import torch
from transformers import BartForConditionalGeneration, Trainer, TrainingArguments, PreTrainedTokenizerFast, AutoTokenizer
import pandas as pd
from load_data import KoBART_data_load, KoBART_Dataset
from compute_metrics import compute_metrics
import random
import numpy as np

def train():
    tokenizer = PreTrainedTokenizerFast.from_pretrained('gogamza/kobart-summarization')
    add_special_tokens = {'additional_special_tokens' : ["[USER]", "[SYSTEM]"]}
        
    tokenizer.add_special_tokens(add_special_tokens)

    model = BartForConditionalGeneration.from_pretrained('gogamza/kobart-summarization')
    model.resize_token_embeddings(len(tokenizer))

    train_df = pd.read_csv("/opt/ml/code/models/summarization/train_data.csv")
    dev_df = pd.read_csv("/opt/ml/code/models/summarization/validation_data.csv")

    print("******데이터 로드*******")
    train_conversations_input_ids, train_score = KoBART_data_load(train_df, tokenizer)
    dev_conversations_input_ids, dev_score = KoBART_data_load(dev_df, tokenizer)

    train_dataset = KoBART_Dataset(train_conversations_input_ids, train_score)
    dev_dataset = KoBART_Dataset(dev_conversations_input_ids, dev_score)

    compute_metrics_use = compute_metrics(tokenizer)

    training_args = TrainingArguments(
        learning_rate=7e-6,
        save_strategy="steps",
        evaluation_strategy="steps",
        metric_for_best_model="rouge-1",
        num_train_epochs=20,
        per_device_train_batch_size=32,
        per_device_eval_batch_size=32,
        output_dir="/opt/ml/code/models/summarization/kobart_output",
        eval_steps=10,
        logging_steps=10,
        load_best_model_at_end=True,
        weight_decay=0.1,
        save_total_limit=3,
    )

    trainer = Trainer(
        model=model,
        train_dataset=train_dataset,
        eval_dataset=dev_dataset,
        args=training_args,
        compute_metrics=compute_metrics_use.compute_rouge,
    )

    trainer.train()
    model.save_pretrained('/opt/ml/code/models/summarization/kobart_output')
    
if __name__ == '__main__':
    train()