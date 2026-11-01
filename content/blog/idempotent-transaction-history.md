---
title: "같은 거래가 두 번 들어와도 이력이 망가지지 않게"
date: "2026-11-02"
category: "database"
tags: ["mongodb", "idempotency", "decimal"]
summary: "Solthumb에서 거래 식별값과 사용자 ID 기준 upsert, Decimal.js 계산으로 보유 수량과 수익률을 안정적으로 제공한 방법입니다."
draft: false
---

## 왜 중복이 생기는가

Solthumb에는 재시도가 있습니다. 외부 체인 데이터가 늦으면 분석 작업을 다시 시도하고, 서버가 재시작되면 작업을 복구합니다. 재시도가 있는 시스템에서는 **같은 거래가 두 번 처리될 수 있다**고 가정해야 합니다.

그냥 `insert`를 쓰면 같은 거래가 이력에 두 줄로 남고, 보유 수량과 수익률이 모두 틀어집니다.

## 키를 먼저 정한다

해결의 핵심은 "무엇이 같은 거래인가"를 정하는 것입니다. Solthumb에서는 **거래 식별값과 사용자 ID**를 기준으로 삼아 upsert했습니다.

```ts
// 구조를 설명하기 위한 예시 코드입니다.
await history.updateOne(
  { txId, userId },
  { $set: { type, tokenAmount, network } },
  { upsert: true },
);
```

몇 번을 실행해도 결과가 같으니, 재시도 정책을 짤 때 중복을 걱정하지 않아도 됩니다. 일반적으로는 이 조합에 유니크 인덱스도 걸어 두어야 동시 요청까지 막을 수 있습니다.

## 금액은 부동소수점으로 계산하지 않는다

자바스크립트의 `number`는 금액 계산에 맞지 않습니다.

```ts
0.1 + 0.2; // 0.30000000000000004
```

토큰은 소수점 아래 자릿수가 길어서 오차가 금방 눈에 띕니다. 그래서 보유 수량, 평균 매수가, 평가 금액, 수익률을 Decimal.js로 계산했습니다.

```ts
// 구조를 설명하기 위한 예시 코드입니다.
const value = new Decimal(amount).times(price);
const profitRate = value.minus(cost).div(cost).times(100);
```

## 정리

재시도와 정확한 계산은 따로 놀지 않습니다. 재시도를 안전하게 만드는 것이 멱등성이고, 그 위에서 계산이 정확해야 숫자를 믿을 수 있습니다.
