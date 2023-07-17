import torch
import pandas as pd

class Dataset(torch.utils.data.Dataset):
    def __init__(self, sentence, score):
        self.sentence = sentence
        self.score = score
    
    def __getitem__(self,idx):
        item = {
            'sentence' : self.sentence[idx],
            'labels' : self.score[idx]
        }
        
        return item
    
    def __len__(self):
        return len(self.score)
    
    
def preprocessing(data, tokenizer):

    output = tokenizer(list(data['full_sen']),
                       return_tensors='pt',
                       padding=True,
                       max_length=1028,
                       truncation=True,
              )['input_ids']
    
    score = data['score']
    
    return output, score


def data_load(data_path):
    # data 불러오기
    raw = []

    with open(data_path, "r") as f:
        while True:
            line = f.readline()
            if not line: break
            
            lst = line.split("\t")
            raw.append(lst)

    score, sen1, sen2 = [], [], []
    for lst in raw[1:]:
        score.append(float(lst[4]))
        sen1.append(lst[5])
        sen2.append(lst[6][:-1])
        
    df = pd.DataFrame({"score" : score,
                    "sen1" : sen1,
                    "sen2" : sen2
                    })

    df['full_sen'] = "<cls>" + df['sen1'] + "<sep>" + df['sen2']
    
    return df
