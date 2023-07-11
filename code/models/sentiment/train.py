from preprocessing import *
from model import customized_model
import pandas as pd
from transformers import TrainingArguments, Trainer, AutoTokenizer, AutoConfig
import torch
from sklearn.model_selection import train_test_split

def train():
    device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
    
    model_name = 'klue/roberta-base'
    config = AutoConfig.from_pretrained(model_name)

    custom_model = customized_model(model_name, config=config)
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    df = pd.read_csv("/opt/ml/code/models/sentiment/SentimentData.csv")
    
    train_dataset, val_dataset = train_test_split(df, test_size=0.2, random_state=42)
    #breakpoint()
    before_train, train_labels = tokenized_dataset(train_dataset, tokenizer), extract_labels(train_dataset)
    before_val, val_labels = tokenized_dataset(val_dataset, tokenizer), extract_labels(val_dataset)
    
    train = customized_dataset(before_train, train_labels)
    val = customized_dataset(before_val, val_labels)
    custom_model.to(device)
    
    save_path = "/opt/ml/code/models/sentiment/save"
    log_path = "/opt/ml/code/models/sentiment/log"
    output_path = "/opt/ml/code/models/sentiment"
    training_args = TrainingArguments(output_dir=output_path,
                save_total_limit=3,
                save_steps=100,
                num_train_epochs=3,
                learning_rate=7e-6,
                per_device_train_batch_size=16,
                per_device_eval_batch_size=16,
                warmup_steps=100,
                weight_decay=0.01,
                logging_dir=log_path,
                logging_steps=100,
                logging_strategy='steps',
                save_strategy='steps',
                evaluation_strategy='steps',
                eval_steps=100,
                load_best_model_at_end=True,)
                # report_to="wandb",
                #metric_for_best_model='log loss')
                
    trainer = Trainer(model=custom_model,
            train_dataset=train,
            eval_dataset=val,
            args=training_args)
    print("GPU 이용 여부 ? {device}")
    trainer.train()
    
if __name__ == "__main__":
    train()