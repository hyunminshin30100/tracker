let todo = '';
let lastMidnightFired = '';
let lastNoonFired = '';

function dk(d) {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function checkTime() {
  const now = new Date();
  const key = dk(now);
  const h = now.getHours(), m = now.getMinutes();

  if (h === 0 && m === 0 && lastMidnightFired !== key) {
    lastMidnightFired = key;
    self.registration.showNotification('현민 트래커 — 새로운 하루', {
      body: todo.slice(0, 200) || '오늘 할 일을 확인하세요!',
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📋</text></svg>',
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📋</text></svg>',
      tag: 'tracker-midnight',
      renotify: true
    });
  }

  if (h === 12 && m === 0 && lastNoonFired !== key) {
    lastNoonFired = key;
    self.registration.showNotification('현민 트래커 — 점심 체크', {
      body: todo.slice(0, 200) || '오늘 할 일 중간 점검!',
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📋</text></svg>',
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📋</text></svg>',
      tag: 'tracker-noon',
      renotify: true
    });
  }
}

// 30초마다 시간 체크
setInterval(checkTime, 30 * 1000);

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_ALARM') {
    todo = e.data.todo || '';
  }
  if (e.data && e.data.type === 'UPDATE_TODO') {
    todo = e.data.todo || '';
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
