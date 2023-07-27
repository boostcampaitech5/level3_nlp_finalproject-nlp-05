# level3_nlp_finalproject-nlp-05

<br>

## 🐴Members

|<img src='https://avatars.githubusercontent.com/u/102334596?v=4' height=100 width=100px></img>|<img src='https://avatars.githubusercontent.com/u/86002769?v=4' height=100 width=100px></img>|<img src='https://avatars.githubusercontent.com/u/107304584?v=' height=100 width=100px></img>|<img src='https://avatars.githubusercontent.com/u/60664644?v=4' height=100 width=100px></img>|<img src='https://avatars.githubusercontent.com/u/126854237?v=4' height=100 width=100px></img>
| --- | --- | --- | --- | --- |
| [변성훈](https://github.com/DNA-B) | [서보성](https://github.com/Seoboseong) | [이상민](https://github.com/SangMini2) | [이승우](https://github.com/OLAOOT) | [이예원](https://github.com/aeongaewon) |

<br>

## 📎Fine (diary-generate-chatbot)

![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/098467e4-8595-4bd8-9d6f-de678321a081)

> 부스트캠프 AI-Tech 5기 NLP 트랙 Level3 Product serving 프로젝트입니다.
> ***Fine*** 하루를 기록하고싶지만 시간이 여유치않은 사람들을 대신하여 사용자의 하루를 일기로 생성해주는 프로그램입니다.
> 챗봇과의 대화를 통해 오늘 어디를 갔고, 무엇을 먹었고, 무슨 사진을 찍었는지에 대한 정보를 받게되면 그 정보를 요약하여 일기를 생성합니다.
> 

<br>

### ChatBot
![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/a5e0c152-d0ae-4adc-b74f-26b769be3ea6)

  #### Dataset
  ![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/7a54362d-4213-4371-bb38-7598e52d9fd2)
  ![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/7579ff8f-301a-4343-a20a-6c3d3753acf5)
  + ***gpt-3.5-turbo***를 활용하여 직접 대화 데이터 생성
  
<br>
  
  #### Model Selection
  ![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/24a6a61f-1d0b-41dd-bc25-9d5f2e28ecb0)
  + ***model: nlpai-lab/kullm-polyglot-5.8b-v2***

<br>

-------

<br>

### Diary Generation
![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/ae79c6ff-489f-4b33-973b-8b12f5fac301)
+ ***model: gogamza/kobart-summarization***
  
<br>

### Generation Style Change Model
![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/5317da6f-f318-4e07-bb3e-378dd8b2c3ad)
+ ***model: NHNDQ/bart-speech-style-converter***
  
<br>

------

<br>

### System Architecture
![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/7b98f242-ed4a-444a-93fb-af4cf1b96f32)  
  
<br>

---

<br>

## ✔️Project

### Structure
> 여긴 마무리하면 채우죠


<br>

### Front-End
![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/83b73701-2609-445c-b12b-510705f7a492)
![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/6198c3ea-4e36-44db-980c-a1a6f15c84fd)

<br>

### Back-End
![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/a6c794b1-6bb1-4127-b85c-bd6b08010acb)

<br>

---

<br>

### 향후 개선 방향
  #### Model
  + 챗봇 데이터 생성 방법이 단순해 데이터 다양성 Χ ➡ 생성 flow를 재구성해서 응답 유형을 다양화
  + KULLM 모델 사이즈로 인해 GPU 서버 사용 ➡ 유지 비용 비쌈 ➡ ***경량화*** 필요 
  + 일기 생성에 들어가는 모델 수가 많아 inference 시간 증가 ➡ fine-tuning 으로 모델 수 줄이기

<br>

  #### Service
  + 대화 내용 감성 분석을 바탕으로 그 날에 어울리는 노래, 미디어 등 ***컨텐츠 추천*** 기능
  + QA Task 적용을 통한 사용자의 문장형 질문에 알맞는 ***일기 내용을 검색***하는 기능
  + 챗봇 및 일기 말투 ***커스터마이징*** 기능
  + 음성 인식, 결제 내역, 지도 등 다양한 외부 API 연결
  + 기타 다양한 기능 추가 및 구독 시스템 등 수익 모델 기획을 통해 상업성 도모
  
<br>

---

<br>

💡 __*위에 관한 자세한 내용은 ```랩업리포트 링크```를 참고해주세요.*__

<br>

## Demo
> 공사중
