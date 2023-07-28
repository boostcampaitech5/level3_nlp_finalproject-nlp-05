# level3_nlp_finalproject-nlp-05

<br>

## 🐴Members

|<img src='https://avatars.githubusercontent.com/u/102334596?v=4' height=100 width=100px></img>|<img src='https://avatars.githubusercontent.com/u/86002769?v=4' height=100 width=100px></img>|<img src='https://avatars.githubusercontent.com/u/107304584?v=' height=100 width=100px></img>|<img src='https://avatars.githubusercontent.com/u/60664644?v=4' height=100 width=100px></img>|<img src='https://avatars.githubusercontent.com/u/126854237?v=4' height=100 width=100px></img>
| --- | --- | --- | --- | --- |
| [변성훈](https://github.com/DNA-B) | [서보성](https://github.com/Seoboseong) | [이상민](https://github.com/SangMini2) | [이승우](https://github.com/OLAOOT) | [이예원](https://github.com/aeongaewon) |

<br>

## 📎Fine (diary-generate-chatbot)

![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/44e2ad8d-2f4d-44ee-948f-39ebcd26f32d)



> 부스트캠프 AI-Tech 5기 NLP 트랙 Level3 Product serving 프로젝트입니다.
> ***Fine***는 하루를 기록하고싶지만 시간이 여유치않은 사람들을 대신하여 사용자의 하루를 일기로 생성해주는 프로그램입니다.
> 챗봇과의 대화를 통해 오늘 어디를 갔고, 무엇을 먹었고, 무슨 사진을 찍었는지에 대한 정보를 받게되면 그 정보를 요약하여 일기를 생성합니다.

<br>

## 🤖Model

### PipeLine
![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/409c5e01-b7a7-4c4f-8c4a-84a5379a0d1d)

<br>

---

<br>

### ChatBot
  #### Data
  ![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/e031fb2b-da54-4c04-b59e-78e1c7a97d50)
  ![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/e58f137f-0a5a-408c-a292-1ce92d23f373)
  ![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/283ecebf-ffa4-4614-ab7d-330ae1b706cf)
  + ***gpt-3.5-turbo***를 활용하여 직접 대화 데이터 생성
  + ***Input Sentence:*** 최대 3 turn의 이전 대화 히스토리
  + ***Label:*** Input sentence 다음으로 올 알맞은 system 응답 → ***train 1696개, test 340개***

<br>
<br>
  
  #### Model Selection
  ![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/47ba8853-d7c1-412b-b632-c6896196b539)
  + ***Goal:*** ***공감 능력을 갖춘 시스템의 적절한 리액션***과 ***자연스러운 질문***을 통한 오늘 하루의 정보 유도
  + ***model: nlpai-lab/kullm-polyglot-5.8b-v2***
  + ***metric:  ROUGE-1, ROUGE-SU, Similarity, Perplexity***
  
<br>

---

<br>

### Summarization Model
![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/c360b8d0-7a64-48e2-8119-584a0b16c85e)

<br>

  #### Data
  ![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/33b76d2a-29e1-4008-8f1c-791318ecc548)
  + ***ChatGPT***를 이용하여 대화 요약 데이터 직접 생성
  + ***341개***

<br>
<br>

  #### Model Selection
  ![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/ca02f237-ece2-475a-bac1-f7e5708532c1)
  + ***Goal:*** ***Controllability***와 ***Monetary Cost*** 고려 ➡ ***GPT API***를 사용하지 않는 방향으로 방안 모색
  + ***model: gogamza/kobart-summarization***
  + ***metric: ROUGE-1, ROUGE-SU***
    
<br>

---

<br>

### Generation Style Change Model
![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/f930733c-e0b2-47f6-b15f-3bb30c2b3857)
+ 한국어 문체 스타일 변환 ***"SmileStyle"*** 데이터셋으로 파인튜닝한 모델로 실험
+ 실험 결과 이미 그 자체로 ***input data의 훼손이 적고*** ***문체 스타일 변환도 잘 이루어지는 것***을 확인
+ ***model: NHNDQ/bart-speech-style-converter***
  
<br>

## 🌐Web
### Front-End
![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/e7a8e0bb-fe8c-48d8-a08d-6ec1468e19b1)
![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/6198c3ea-4e36-44db-980c-a1a6f15c84fd)

<br>
<br>

### Back-End
![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/a6c794b1-6bb1-4127-b85c-bd6b08010acb)

<br>

## 📐System Architecture
### Structure
> 여긴 마무리하면 채우죠

![image](https://github.com/boostcampaitech5/level3_nlp_finalproject-nlp-05/assets/102334596/7b98f242-ed4a-444a-93fb-af4cf1b96f32)

<br>

## 🛠️향후 개선 방향
  ### Model
  + 챗봇 데이터 생성 방법이 단순해 데이터 다양성 Χ ➡ 생성 flow를 재구성해서 ***응답 유형을 다양화***
  + KULLM 모델 사이즈로 인해 GPU 서버 사용 ➡ 유지 비용 비쌈 ➡ ***경량화*** 필요
  + Summarization시 ***동일한 내용을 중복으로 생성***하는 경우가 있음(같은 내용을 두 번 이상 반복하는 것은 ROUGE score에 적극적으로 반영되지 않음) ➡ ***평가 지표 및 모델 성능 개선*** 필요

<br>

  ### Service
  + 대화 내용 감성 분석을 바탕으로 그 날에 어울리는 노래, 미디어 등 ***컨텐츠 추천*** 기능
  + QA Task 적용을 통한 사용자의 문장형 질문에 알맞는 ***일기 내용을 검색***하는 기능
  + 챗봇 및 일기 말투 ***커스터마이징*** 기능
  + 음성 인식, 결제 내역, 지도 등 ***다양한 외부 API 연결***
  + 기타 다양한 기능 추가 및 구독 시스템 등 ***수익 모델 기획***을 통해 상업성 도모

<br>

## 🧪Demo
> 공사중

<br>
<br>

> 💡 __*프로젝트에 관한 자세한 내용은 ```랩업리포트 링크```를 참고해주세요.*__
