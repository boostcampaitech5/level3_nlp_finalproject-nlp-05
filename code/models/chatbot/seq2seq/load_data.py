import pandas as pd
import torch
from tqdm import tqdm


class Dataset(torch.utils.data.Dataset):
  def __init__(self, text, labels):
    self.text = text
    self.labels = labels

  def __getitem__(self, idx):
    item = {key: val[idx] for key, val in self.text.items()}
    item['labels'] = self.labels[idx]
    return item

  def __len__(self):
    return len(self.labels)


def preprocessing_dataset(df, tokenizer):
    input_texts = []
    labels = []
    eos_len = len(tokenizer.eos_token)
    
    for idx, row in tqdm(df.iterrows(), total=len(df), desc="Preprocessing Data: "):
        input_texts.append(row['input_texts'][:-eos_len])
        labels.append(row['labels'][:-eos_len])
        
    out_df = pd.DataFrame({'input_texts': input_texts, 'labels': labels})

    return out_df

def load_data(data_dir, tokenizer, pre=True):
    data_df = pd.read_csv(data_dir)
    if pre:
      data_df = preprocessing_dataset(data_df, tokenizer)

    return data_df

def tokenized_dataset(data, tokenizer, max_length):
    with tqdm(total=len(data), desc="Tokenizing Text", unit="text") as pbar:
        tokenized_text = tokenizer(
          list(data['input_texts']),
        )
        pbar.update(len(data))
    
        for i in range(len(tokenized_text['input_ids'])):
            if len(tokenized_text['input_ids'][i]) > max_length:
                for key, val in tokenized_text.items():
                    tokenized_text[key][i] = val[i][-max_length:]
            
    with tqdm(total=len(data), desc="Tokenizing Labels", unit="text") as pbar:
        with tokenizer.as_target_tokenizer():
            tokenized_labels = tokenizer(
              list(data['labels']),
            )
        pbar.update(len(data))   
        
        for i in range(len(tokenized_labels['input_ids'])):
            if len(tokenized_labels['input_ids'][i]) > max_length:
                for key, val in tokenized_labels.items():
                    tokenized_labels[key][i] = val[i][-max_length:]

    return tokenized_text, tokenized_labels['input_ids']