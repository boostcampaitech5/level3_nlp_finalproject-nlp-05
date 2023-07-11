import pandas as pd
import torch

def extract_labels(df):
    sent_dic = {'기쁨' : 0, '당황' : 1, "분노" : 2, "불안" : 3, "상처" : 4, "슬픔" : 5}
    labeling = []

    for i in range(len(df)):
        labeling.append(sent_dic[df.iloc[i, 5]]) # 감정_대분류
         
    return labeling


def tokenized_dataset(dataset, tokenizer):
    tokenized_sentences = tokenizer(list(dataset['사람문장1']),
                       return_tensors='pt',
                       padding=True,
                       truncation=True,
                       max_length=128
    )

    return tokenized_sentences 

class customized_dataset(torch.utils.data.Dataset):
    def __init__(self, dataframe, labels):
        self.labels = labels
        self.dataframe = dataframe
        
    def __len__(self):
        return len(self.labels)
    
    def __getitem__(self, idx):
        item = {key: val[idx].clone().detach() for key, val in self.dataframe.items()}
        item['labels'] = torch.tensor(int(self.labels[idx]))
        
        return item