---
title: "BullMQ 영속 작업으로 온체인 거래 분석을 복구 가능하게 만들기"
date: "2026-02-24"
category: "backend"
tags: ["bullmq", "redis", "queue"]
summary: "외부 체인 데이터 지연과 서버 재시작 사이에서도 거래 이력 누락 가능성을 낮춘 큐 설계와 재시도 전략을 정리했습니다."
draft: false
---

## 문제

Solthumb은 Solana, Hedera, BSC, Ethereum 네 네트워크의 거래를 하나의 이력으로 통합합니다. 외부 체인 데이터가 늦게 도착하거나 분석 도중 서버가 재시작되면, 오프체인 이력이 누락될 수 있었습니다.

## 먼저 작업으로 등록하기

거래 식별값과 사용자 정보를 BullMQ 영속 작업으로 먼저 등록하도록 했습니다. 서버가 재시작되어도 등록된 작업에서 후속 분석을 복구할 수 있습니다.

## 재시도와 실패 기록

외부 데이터 지연에는 최대 10회까지 재시도하고, 끝내 실패한 작업은 별도로 남겼습니다.

```ts
// 예시 코드입니다. 실제 코드는 아닙니다.
await queue.add("analyze-transaction", { txId, userId }, { attempts: 10 });
```
