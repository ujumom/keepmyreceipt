# Kaggle Dataset

### **Synthetic Financial Datasets For Fraud Detection**

[https://www.kaggle.com/datasets/ealaxi/paysim1](https://www.kaggle.com/datasets/ealaxi/paysim1)

- 어제 다같이 봤던 데이터셋 조사 내용 추가
- 실제 로그 데이터를 기반으로 한 시뮬레이션 데이터
- type 설명
  
    > **CASH-IN** is the process of increasing the balance of account by payingin cash to a merchant.
    > 
    > 
    > **CASH-OUT** is the opposite process of CASH-IN, it means to withdrawcash from a merchant which decreases the balance of the account. 
    > 
    > **DEBIT** is similar process than CASH-OUT and involves sending themoney from the mobile money service to a bank account. 
    > 
    > **PAYMENT** is the process of paying for goods or services to merchantswhich decreases the balance of the account and increases the balance of the receiver.
    > 
    > **TRANSFER** is the process of sending money to another user of theservice through the mobile money platform.
    > 
    > 출처: 링크 설명 하단의 논문 ([http://bth.diva-portal.org/smash/record.jsf?pid=diva2%3A955852&dswid=-7978](http://bth.diva-portal.org/smash/record.jsf?pid=diva2%3A955852&dswid=-7978))
    > 
- amount가 old balance랑 같으면 사기인 듯? 
  (**If amount equals the old balance then it is fraud!!)**
  
    [https://www.kaggle.com/datasets/ealaxi/paysim1/discussion/99799](https://www.kaggle.com/datasets/ealaxi/paysim1/discussion/99799) 
  
    > I get an ROC score of 0.99 and an average precision of 0.98 usingdf.amount == df['oldbalanceOrg']as prediction for fraud.
    > 
  
    > I think the transactions which are detected as fraud are cancelled, so for fraud detection those 2 columns must not be used.
    > 

### **Credit Card Transactions**

[https://www.kaggle.com/datasets/ealtman2019/credit-card-transactions](https://www.kaggle.com/datasets/ealtman2019/credit-card-transactions) 

- 다른 데이터
- 이 역시 시뮬레이션 데이터임
  
    > This data has more than 20 million transactions 
    generated from a multi-agent virtual world simulation performed by IBM