from transformers import AutoTokenizer, AutoModel, TrainingArguments, Trainer
import torch, random
import pandas as pd
from sklearn.model_selection import train_test_split
import numpy as np
import wandb
from load_data import Dataset, preprocessing, data_load
from models import Encoder_model


def train():
    seed = 418
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


    add_special_tokens = {'sep_token' : "<sep>",
                        "cls_token" : "<cls>"}


    model_name = "gogamza/kobart-base-v2"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    tokenizer.add_special_tokens(add_special_tokens)
        
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

    training_args = TrainingArguments(
                output_dir="/opt/ml/code/models/summarization/output",
                save_total_limit=3,
                save_steps=100,
                num_train_epochs=1,
                learning_rate=7e-6,
                per_device_train_batch_size=16,
                per_device_eval_batch_size=16,
                warmup_steps=100,
                weight_decay=0.1,
                logging_dir="/opt/ml/code/models/summarization/log",
                logging_steps=100,
                logging_strategy='steps',
                save_strategy='steps',
                evaluation_strategy='steps',
                eval_steps=100,
                load_best_model_at_end=True,
                metric_for_best_model='loss')



    trainer = Trainer(
        model=encoder_model,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        args=training_args,
    )

    trainer.train()

if __name__ == '__main__':
    train()