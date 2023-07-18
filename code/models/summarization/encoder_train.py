from transformers import AutoTokenizer, AutoModel, TrainingArguments, Trainer
import torch, random
import pandas as pd
from sklearn.model_selection import train_test_split
import numpy as np
import wandb
from load_data import Dataset, preprocessing, data_load
from models import Encoder_model
from custom_tokenizer import custom_tokenizer


def train():
    seed = 418
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


    model_name = "gogamza/kobart-base-v2"
    tokenizer = custom_tokenizer(model_name)
        
    # data 불러오기
    
    train_df = data_load("/opt/ml/code/models/summarization/sts-train.tsv")
    val_df = data_load("/opt/ml/code/models/summarization/sts-dev.tsv")

    train_tokenized, train_score = preprocessing(train_df, tokenizer)
    val_tokenized, val_score = preprocessing(val_df, tokenizer)

    train_dataset = Dataset(train_tokenized, train_score)
    val_dataset = Dataset(val_tokenized, val_score)

    encoder_model = Encoder_model(model_name, tokenizer)


    device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
    
    encoder_model.to(torch.double) # 데이터 타입 맞춰주기
    encoder_model.to(device)
    print(device)

    wandb.init(project="final")
    wandb.run.name = 'text_similarity_training, lr=7e-6, batch=64,'
    training_args = TrainingArguments(
                output_dir="/opt/ml/code/models/summarization/output",
                save_total_limit=3,
                save_steps=50,
                num_train_epochs=10,
                learning_rate=7e-6,
                per_device_train_batch_size=64,
                per_device_eval_batch_size=64,
                warmup_steps=50,
                weight_decay=0.1,
                logging_dir="/opt/ml/code/models/summarization/log",
                logging_steps=50,
                logging_strategy='steps',
                save_strategy='steps',
                evaluation_strategy='steps',
                eval_steps=50,
                load_best_model_at_end=True,
                metric_for_best_model='loss',
                report_to='wandb')



    trainer = Trainer(
        model=encoder_model,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        args=training_args,
    )

    trainer.train()

if __name__ == '__main__':
    train()