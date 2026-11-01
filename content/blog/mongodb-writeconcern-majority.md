---
title: "MongoDB Atlas 복제 지연을 writeConcern majority로 줄인 기록"
date: "2026-03-12"
category: "database"
tags: ["mongodb", "replication"]
summary: "가입 직후 조회 실패가 왜 간헐적으로 발생했는지 추적하고, 쓰기 보장 수준을 조정해 운영 이슈를 줄인 과정입니다."
draft: false
---

## 문제

Salt Hub에서 가입 직후의 조회가 간헐적으로 실패했습니다.

## 원인

원인은 MongoDB Atlas의 복제 지연이었습니다. 쓰기가 끝난 직후의 조회가 아직 복제되지 않은 데이터를 보면, 방금 가입한 사용자를 찾지 못합니다.

## 해결

쓰기 보장 수준을 `majority`로 올렸습니다. 다수의 노드에 복제된 뒤에 쓰기가 완료되므로 가입 직후의 조회 실패가 사라졌습니다.

```ts
// 예시 코드입니다. 실제 코드는 아닙니다.
await users.insertOne(user, { writeConcern: { w: "majority" } });
```
