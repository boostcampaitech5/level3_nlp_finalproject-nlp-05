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
SAVED_PATH = '/opt/ml/KULLM/yeah' # 모델 경로

model = GPTNeoXForCausalLM.from_pretrained(
    SAVED_PATH,
    torch_dtype=torch.float16,
    low_cpu_mem_usage=True,
).to(device=f"cuda", non_blocking=True)


model.eval()
pipe = pipeline("text-generation", model=model, tokenizer=MODEL, device=0)
prompter = Prompter("kullm")

# 과거 대화 history를 순서대로 다음과 같이 받습니다. 0~5개의 대화 데이터.
chat_history = ["system: 안녕하세요! 오늘 하루는 어떠셨나요? 무슨 재미있는 일이 있었나요?",
                "user: 오늘 친구랑 피자를 먹었어.",
                "system: 좋아요! 피자를 먹는 건 항상 즐거운 일이죠. 어떤 종류의 피자를 먹었나요?",
                "user: 포테이토 피자를 먹었어! 생각보다 맛은 없었지만 친구랑 같이 먹어서 좋았어.",
                "system: 포테이토 피자도 맛있는 편이죠! 친구와 함께 먹으면서 어떤 이야기를 나눴나요?"] 

if len(chat_history) == 0: 
    bot_response = "안녕하세요! 오늘 하루는 어떠셨나요? 무슨 재미있는 일이 있었나요?"
    print("Bot: ", bot_response) # 대화 history가 없고 첫 시작이라면, 다음 응답을 생성
    
    bot_response = "system: " + bot_response # chat history 에 저장이 될 땐 앞에 system이 붙어야 합니다. 이후 생성은 자동으로 system이 붙도록 fine tuning 이 되어 있습니다.
    chat_history.append(bot_response)
else:
    input_text = input(">> User: ") # system 응답이 무조건 chat history의 마지막에 옵니다. 그러므로 그 마지막 응답에 맞는 user의 대답을 입력받습니다.
    
    chat_history.append("user: " + input_text) # 사용자 응답을 chat history에 추가합니다.
    
    instruction = "주어진 문장들은 이전 대화 내용들입니다. 이에 알맞은 시스템 응답을 만들어주세요."
    bot_response = infer(pipe=pipe, prompter=prompter, instruction=instruction, input_text=' '.join(chat_history)) # chat history를 바탕으로 bot response 생성
    
    if len(input_text) <= 6: # input text의 길이가 6 이하라면, bot response를 다음으로 바꿔줍니다.
        bot_response = "system: 오늘 더 특별한 일은 없으셨나요? 더 자세히 말씀해 주세요!" 
        
    print(bot_response[-len("system: "):]) # bot response는 생성될 때, system이 붙도록 생성됩어서 이를 제거하고 출력합니다.
    chat_history.append(bot_response) # bot response를 chat history에 추가합니다.
    
    if len(chat_history) > 5: # chat history는 5개까지만 저장합니다.
        chat_history = chat_history[-5:]