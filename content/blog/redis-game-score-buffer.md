---
title: "게임 점수를 매번 DB에 쓰지 않기로 한 이유"
date: "2026-11-02"
category: "backend"
tags: ["redis", "mongodb", "performance"]
summary: "Salt Hub의 게임 점수를 Redis에 임시로 누적하고, 게임이 끝날 때 최종 점수만 MongoDB에 저장한 구조를 정리했습니다."
draft: false
---

## 문제

Salt Hub는 Telegram 미니앱 기반의 포인트 파밍 서비스였고, 그 안에 게임이 있었습니다. 게임 점수는 플레이 중에 계속 바뀝니다. 바뀔 때마다 DB에 쓰면 쓰기 요청은 사용자 수가 아니라 **점수가 바뀌는 횟수**만큼 늘어납니다.

그래서 중간 값은 영구 저장하지 않고, 최종 점수만 남기기로 했습니다.

## 구조

저장소의 역할을 둘로 나눴습니다.

| 시점 | 저장소 | 하는 일 |
| --- | --- | --- |
| 게임 중 | Redis | 점수를 임시로 누적 |
| 게임 종료 요청 | MongoDB | 최종 점수만 저장 |

이렇게 하면 게임 하나당 MongoDB 쓰기가 종료 시점 한 번으로 줄어듭니다.

```ts
// 구조를 설명하기 위한 예시 코드입니다.
async function addScore(gameId: string, delta: number) {
  await redis.incrby(`game:${gameId}:score`, delta);
}

async function finishGame(gameId: string, userId: string) {
  const score = Number(await redis.get(`game:${gameId}:score`));
  await games.updateOne({ gameId, userId }, { $set: { score, finishedAt: new Date() } });
  await redis.del(`game:${gameId}:score`);
}
```

## 이 구조에서 조심할 점

쓰기를 뒤로 미루는 구조에는 공통된 약점이 있습니다.

- **종료 요청이 오지 않는 경우:** 사용자가 앱을 그냥 닫으면 최종 저장이 일어나지 않습니다. 키에 만료 시간을 두고, 끝나지 않은 게임을 어떻게 처리할지 정해야 합니다.
- **Redis 장애:** 임시 점수는 영구 데이터가 아니므로, 잃어도 되는 값인지 먼저 판단해야 합니다.
- **조작:** 클라이언트가 보낸 점수를 그대로 믿으면 안 됩니다. 저장소를 바꾼다고 해결되는 문제가 아니므로 별도로 검증해야 합니다.

## 정리

"이 값이 언제 영구적이어야 하는가"를 먼저 물으면 저장소 선택이 쉬워집니다. 중간 과정은 빠른 저장소에, 결과는 믿을 수 있는 저장소에 두는 것입니다.
