from transformers import BertPreTrainedModel, AutoModel
import torch

class customized_model(BertPreTrainedModel):
    def __init__(self, model_name, config):
        super().__init__(config)
        
        self.model = AutoModel.from_pretrained(model_name)
        self.linear_layer = torch.nn.Linear(self.model.config.hidden_size,6)
        self.config = config
        
    def forward(self, input_ids, attention_mask, token_type_ids=None, labels=None):
        output = self.model(input_ids, attention_mask, token_type_ids)['pooler_output']
        real_output = self.linear_layer(output)
        
        loss = None
        
        if labels is not None:
            loss_func = torch.nn.CrossEntropyLoss()
            real_output = real_output.squeeze()
            loss = loss_func(real_output, labels)
        
        outputs = {"loss" : loss, "logits" : real_output}
        
        return outputs