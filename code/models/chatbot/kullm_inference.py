import torch
import wandb
import yaml
import os
import numpy as np
import pandas as pd
import random
import argparse

from transformers import pipeline, GPTNeoXForCausalLM, AutoTokenizer
from kullm.utils.prompter import Prompter

from seq2seq.compute_metrics import Evaluation_Metrics
from tqdm import tqdm


def infer(pipe, prompter, instruction="", input_text=""):
    prompt = prompter.generate_prompt(instruction, input_text)
    output = pipe(prompt, max_length=512, temperature=0.2, num_beams=5, eos_token_id=2)
    s = output[0]["generated_text"]
    result = prompter.get_response(s)

    return result

def inference(CFG):
    model = GPTNeoXForCausalLM.from_pretrained(
        CFG['MODEL_SAVE_DIR'],
        torch_dtype=torch.float16,
        low_cpu_mem_usage=True,
    ).to(device=f"cuda", non_blocking=True)

    model.eval()

    tokenizer = AutoTokenizer.from_pretrained(CFG['MODEL_NAME'])
    
    pipe = pipeline("text-generation", model=model, tokenizer=CFG['MODEL_NAME'], device=0)
    prompter = Prompter("kullm")
    evaluation = Evaluation_Metrics(tokenizer)
    
    wandb.init(project=CFG['WANDB_PROJECT'], name=CFG['WANDB_NAME'])
    
    test_data = pd.read_csv(CFG['TEST_PATH'])
    predictions = []
    labels = []
    
    for idx, row in tqdm(test_data.iterrows(), total=len(test_data)):
        result = infer(pipe=pipe, prompter=prompter, instruction="주어진 문장들은 이전 대화 내용들입니다. 이에 알맞은 시스템 응답을 만들어주세요.", 
                       input_text=row['input_texts'])
        labels.append(row['labels'])
        predictions.append(result)
        
    similarity = evaluation.calculate_similarity(predictions, labels)
    rouge = evaluation.calculate_rouge(predictions, labels)
    
    wandb.log({
        'rouge-su': rouge['rougeSU'],
        'rouge1': rouge['rouge1'],
        'similarity_scores': similarity
    })
    
    test_data['prediction'] = predictions
    test_data.to_csv('/opt/ml/prediction/prediction.csv')
    
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="")
    parser.add_argument(
        "--args_path", default=f"/opt/ml/code/models/chatbot/config.yaml", type=str, help=""
    )
    arg = parser.parse_args()

    with open(arg.args_path) as f:
        CFG = yaml.safe_load(f)
        
    random.seed(CFG['SEED'])
    np.random.seed(CFG['SEED'])
    os.environ["PYTHONHASHSEED"] = str(CFG['SEED'])
    torch.manual_seed(CFG['SEED'])
    torch.cuda.manual_seed(CFG['SEED'])  
    torch.backends.cudnn.deterministic = True 
    torch.backends.cudnn.benchmark = True
        
    inference(CFG)