import torch
import wandb
import yaml
import os
import numpy as np
import random
import math
import argparse

from transformers import (
    AutoConfig,
    PreTrainedTokenizerFast,
    AutoModelForCausalLM,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling,
    AdamW, 
    get_linear_schedule_with_warmup
)

from load_data import *
from compute_metrics import Evaluation_Metrics


def train(CFG):
    device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
    
    MODEL_NAME = CFG['MODEL_NAME']
    
    if MODEL_NAME == 'skt/kogpt2-base-v2':
        tokenizer = PreTrainedTokenizerFast.from_pretrained(MODEL_NAME, eos_token='</s>', pad_token='<pad>')
    else:
        tokenizer = PreTrainedTokenizerFast.from_pretrained(MODEL_NAME)
    
    config = AutoConfig.from_pretrained(MODEL_NAME,
                                        eos_token=tokenizer.eos_token,
                                        pad_token=tokenizer.pad_token)
                                                        
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME, config=config).to(device)
    evaluation = Evaluation_Metrics(tokenizer)
    
    if MODEL_NAME == 'nlpai-lab/kullm-polyglot-5.8b-v2':
        for name, param in model.named_parameters():
            if 'embed' not in name:
                param.requires_grad = False 
    
    wandb.init(project=CFG['WANDB_PROJECT'], name=CFG['WANDB_NAME'])
    
    training_args = TrainingArguments(
        evaluation_strategy='steps',
        eval_steps=CFG['EVAL_STEP'],
        learning_rate=CFG['LR'],
        logging_dir='./logs',
        logging_steps=CFG['LOGGING_STEP'],
        # load_best_model_at_end=True,
        num_train_epochs=CFG['MAX_EPOCH'],
        output_dir='./results',
        per_device_train_batch_size=CFG['TRAIN_BATCH_SIZE'],
        per_device_eval_batch_size=CFG['EVAL_BATCH_SIZE'],
        save_strategy='steps',
        save_steps=CFG['SAVING_STEP'],
        save_total_limit=1,
        warmup_steps=CFG['WARMUP_STEP'],
        weight_decay=CFG['WEIGHT_DECAY'],
        report_to='wandb'
    )
    
    data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)
    
    train_data = load_data(CFG['TRAIN_PATH'], tokenizer,
                           pre=True if MODEL_NAME == 'nlpai-lab/kullm-polyglot-5.8b-v2' else False)
    dev_data = load_data(CFG['DEV_PATH'], tokenizer,
                         pre=True if MODEL_NAME == 'nlpai-lab/kullm-polyglot-5.8b-v2' else False)
    
    tokenized_train = tokenized_dataset(train_data, tokenizer)
    tokenized_dev = tokenized_dataset(dev_data, tokenizer)
  
    train_dataset = Dataset(tokenized_train)
    dev_dataset = Dataset(tokenized_dev)
    
    optimizer = AdamW(filter(lambda p: p.requires_grad, model.parameters()), lr=training_args.learning_rate, weight_decay=training_args.weight_decay)
    total_steps = math.ceil(len(train_dataset) / training_args.per_device_train_batch_size) * training_args.num_train_epochs
    lr_scheduler = get_linear_schedule_with_warmup(
        optimizer,
        num_warmup_steps=training_args.warmup_steps,
        num_training_steps=total_steps
    )
    
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=dev_dataset,
        compute_metrics=evaluation.compute_metrics,
        preprocess_logits_for_metrics=evaluation.preprocess_logits_for_metrics,
        data_collator=data_collator,
        #optimizers= (optimizer, lr_scheduler)
    )
    
    trainer.train()
    model.save_pretrained(CFG['MODEL_SAVE_DIR'])
    
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