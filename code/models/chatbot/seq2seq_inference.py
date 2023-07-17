import torch
import wandb
import yaml
import os
import numpy as np
import random
import argparse

from transformers import (
    AutoConfig,
    AutoTokenizer,
    AutoModelForSeq2SeqLM,
    Seq2SeqTrainingArguments,
    Seq2SeqTrainer,
    DataCollatorForSeq2Seq,
)

from seq2seq.load_data import *
from seq2seq.compute_metrics import Evaluation_Metrics


def train(CFG):
    device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
    
    MODEL_NAME = CFG['MODEL_NAME']
    
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)                                                        
    model = AutoModelForSeq2SeqLM.from_pretrained(CFG['MODEL_SAVE_DIR']).to(device)
    
    evaluation = Evaluation_Metrics(tokenizer)

    wandb.init(project=CFG['WANDB_PROJECT'], name=CFG['WANDB_NAME'])
    
    training_args = Seq2SeqTrainingArguments(
        evaluation_strategy='steps',
        eval_steps=CFG['EVAL_STEP'],
        fp16=True,
        learning_rate=CFG['LR'],
        logging_dir='./logs',
        logging_steps=CFG['LOGGING_STEP'],
        num_train_epochs=CFG['MAX_EPOCH'],
        output_dir='./results',
        per_device_train_batch_size=CFG['TRAIN_BATCH_SIZE'],
        per_device_eval_batch_size=CFG['EVAL_BATCH_SIZE'],
        predict_with_generate=True,
        save_strategy='steps',
        save_steps=CFG['SAVING_STEP'],
        save_total_limit=2,
        warmup_steps=CFG['WARMUP_STEP'],
        weight_decay=CFG['WEIGHT_DECAY'],
        report_to='wandb'
    )
    
    data_collator = DataCollatorForSeq2Seq(tokenizer=tokenizer)
 
    test_data = load_data(CFG['TEST_PATH'], tokenizer,
                            pre=False if MODEL_NAME == 'gogamza/kobart-base-v2' else True)

    tokenized_test, tokenized_test_labels = tokenized_dataset(test_data, tokenizer, CFG['MAX_LENGTH'])
  
    test_dataset = Dataset(tokenized_test, tokenized_test_labels)
    
    trainer = Seq2SeqTrainer(
        model=model,
        args=training_args,
        tokenizer=tokenizer,
        compute_metrics=evaluation.compute_metrics,
        #preprocess_logits_for_metrics=evaluation.preprocess_logits_for_metrics,
        data_collator=data_collator,
    )
    
    predictions = trainer.predict(test_dataset) # predictions, label_ids, metrics
    wandb.log(predictions[2])
    predictions = tokenizer.batch_decode(predictions[0], skip_special_tokens=True)

    output = pd.read_csv(CFG['TEST_PATH'])
    output['prediction'] = predictions
    output.to_csv('./prediction/prediction.csv')  
    
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
        
    train(CFG)