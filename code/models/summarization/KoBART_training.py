import torch
# from custom_tokenizer import add_tokenizer
from transformers import BartForConditionalGeneration, Trainer, TrainingArguments, PreTrainedTokenizerFast, AutoTokenizer
import pandas as pd

tokenizer = PreTrainedTokenizerFast.from_pretrained('gogamza/kobart-summarization')
add_special_tokens = {'additional_special_tokens' : ["[USER]", "[SYSTEM]"]}
    
tokenizer.add_special_tokens(add_special_tokens)

model = BartForConditionalGeneration.from_pretrained('gogamza/kobart-summarization')
model.resize_token_embeddings(len(tokenizer))

class Dataset(torch.utils.data.Dataset):
  def __init__(self, input_ids, labels):
    self.input_ids = input_ids
    self.labels = labels

  def __getitem__(self, idx):
    item = {
        "input_ids" : self.input_ids[idx],
        "labels" : self.labels[idx]
    }

    return item

  def __len__(self):
    return len(self.labels)

print("데이터 로드!")
train_df = pd.read_csv("/opt/ml/code/models/summarization/kobart_train_final.csv")
dev_df = pd.read_csv("/opt/ml/code/models/summarization/kobart_test_final.csv")

train_input_ids = tokenizer(
    list(train_df['conversations']),
    return_tensors='pt',
    padding=True
)

train_score = tokenizer(
    list(train_df['summarizations']),
    return_tensors='pt',
    padding=True
)

dev_input_ids = tokenizer(
    list(dev_df['conversations']),
    return_tensors='pt',
    padding=True
)

dev_score = tokenizer(
    list(dev_df['summarizations']),
    return_tensors='pt',
    padding=True
)

train_dataset = Dataset(train_input_ids['input_ids'], train_score['input_ids'])
dev_dataset = Dataset(dev_input_ids['input_ids'], dev_score['input_ids'])

training_args = TrainingArguments(
    learning_rate=7e-6,
    save_strategy="steps",
    evaluation_strategy="steps",
    metric_for_best_model="loss",
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
    args=training_args
)

trainer.train()
model.save_pretrained('/opt/ml/code/models/summarization/kobart_output')