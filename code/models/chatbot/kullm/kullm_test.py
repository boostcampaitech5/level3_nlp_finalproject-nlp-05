import torch
from transformers import pipeline, GPTNeoXForCausalLM
from utils.prompter import Prompter

def infer(pipe, prompter, instruction="", input_text=""):
    prompt = prompter.generate_prompt(instruction, input_text)
    output = pipe(prompt, max_length=512, temperature=0.2, num_beams=5, eos_token_id=2)
    s = output[0]["generated_text"]
    result = prompter.get_response(s)

    return result

MODEL = "nlpai-lab/kullm-polyglot-5.8b-v2"
SAVED_PATH = '/opt/ml/KULLM/yeah' 

model = GPTNeoXForCausalLM.from_pretrained(
    SAVED_PATH,
    torch_dtype=torch.float16,
    low_cpu_mem_usage=True,
).to(device=f"cuda", non_blocking=True)

model.eval()
pipe = pipeline("text-generation", model=model, tokenizer=MODEL, device=0)
prompter = Prompter("kullm")

chat_history = [
    "system: 안녕하세요! 오늘 하루는 어떠셨나요? 무슨 재미있는 일이 있었나요?"
]
print(chat_history[0])

while True:
    if len(chat_history) > 5:
        chat_history = chat_history[-5:]
    
    input_text = input(">> User: ")
    
    if input_text == "bye":
        break
    
    chat_history.append("user: " + input_text)
    
    instruction = "주어진 문장들은 이전 대화 내용들입니다. 이에 알맞은 시스템 응답을 만들어주세요."
    bot_response = infer(pipe=pipe, prompter=prompter, instruction=instruction, input_text=' '.join(chat_history))
    
    if len(input_text) <= 6:
        bot_response = "system: 오늘 더 특별한 일은 없으셨나요? 더 자세히 말씀해 주세요!"
        
    print(bot_response)
    chat_history.append(bot_response)