// ========================================
// 공통 유틸리티 함수
// ========================================

// ---- 예약번호 생성 ----
function generateBookingNumber() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'B-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ---- 토스트 메시지 ----
function showToast(message, duration = 2500) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ---- 로딩 오버레이 ----
function showLoading(message = '처리 중...') {
  let overlay = document.getElementById('loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `<div class="spinner"></div><p>${message}</p>`;
    document.body.appendChild(overlay);
  } else {
    overlay.querySelector('p').textContent = message;
    overlay.style.display = 'flex';
  }
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.style.display = 'none';
}

// ---- 모달 ----
function showModal(title, message, onConfirm, confirmText = '확인', cancelText = '취소') {
  let overlay = document.getElementById('modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <h3 id="modal-title"></h3>
        <p id="modal-message"></p>
        <div class="modal-buttons">
          <button class="modal-btn-cancel" id="modal-cancel">${cancelText}</button>
          <button class="modal-btn-confirm" id="modal-confirm">${confirmText}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-message').textContent = message;
  document.getElementById('modal-cancel').textContent = cancelText;
  document.getElementById('modal-confirm').textContent = confirmText;

  overlay.classList.add('active');

  document.getElementById('modal-cancel').onclick = () => {
    overlay.classList.remove('active');
  };

  document.getElementById('modal-confirm').onclick = () => {
    overlay.classList.remove('active');
    if (onConfirm) onConfirm();
  };
}

// ---- Firestore: 해당 프로그램/시간대의 예약 참여자 수 조회 ----
async function getSlotCount(programId, slotId) {
  const snapshot = await db.collection('reservations')
    .where('programId', '==', programId)
    .where('timeSlot', '==', slotId)
    .where('status', '==', 'confirmed')
    .get();

  let total = 0;
  snapshot.forEach(doc => {
    total += doc.data().participantCount;
  });
  return total;
}

// ---- Firestore: 모든 시간대의 잔여석 조회 ----
async function getAllSlotCounts(programId) {
  const counts = {};
  TIME_SLOTS.forEach(slot => { counts[slot.id] = 0; });

  const snapshot = await db.collection('reservations')
    .where('programId', '==', programId)
    .where('status', '==', 'confirmed')
    .get();

  snapshot.forEach(doc => {
    const data = doc.data();
    counts[data.timeSlot] = (counts[data.timeSlot] || 0) + data.participantCount;
  });

  return counts;
}

// ---- Firestore: 실시간 리스너로 시간대 현황 감시 ----
function watchSlotCounts(programId, callback) {
  return db.collection('reservations')
    .where('programId', '==', programId)
    .where('status', '==', 'confirmed')
    .onSnapshot(snapshot => {
      const counts = {};
      TIME_SLOTS.forEach(slot => { counts[slot.id] = 0; });

      snapshot.forEach(doc => {
        const data = doc.data();
        counts[data.timeSlot] = (counts[data.timeSlot] || 0) + data.participantCount;
      });

      callback(counts);
    });
}

// ---- 전화번호 포맷 ----
function formatPhone(phone) {
  const nums = phone.replace(/\D/g, '');
  if (nums.length === 11) {
    return nums.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (nums.length === 10) {
    return nums.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  return phone;
}

// ---- 전화번호 검증 ----
function isValidPhone(phone) {
  const nums = phone.replace(/\D/g, '');
  return nums.length >= 10 && nums.length <= 11 && nums.startsWith('01');
}

// ---- URL 파라미터 읽기 ----
function getParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

// ---- 카카오톡 공유 ----
function shareKakao(programId) {
  const program = PROGRAMS[programId];
  if (!program) return;

  if (typeof Kakao === 'undefined' || !Kakao.isInitialized()) {
    // 카카오 SDK 미설정 시 기본 공유
    shareDefault(programId);
    return;
  }

  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: program.title,
      description: `${EVENT_INFO.dateShort} | ${program.duration} | 참가비 무료\n${EVENT_INFO.church} ${EVENT_INFO.title}`,
      imageUrl: SITE_URL + '/img/poster.png',
      link: {
        mobileWebUrl: SITE_URL + '/reserve.html?program=' + programId,
        webUrl: SITE_URL + '/reserve.html?program=' + programId,
      },
    },
    buttons: [
      {
        title: '지금 예약하기',
        link: {
          mobileWebUrl: SITE_URL + '/reserve.html?program=' + programId,
          webUrl: SITE_URL + '/reserve.html?program=' + programId,
        },
      },
    ],
  });
}

// 카카오 SDK 미설정 시 대체 공유
function shareDefault(programId) {
  const program = PROGRAMS[programId];
  const url = SITE_URL + '/reserve.html?program=' + programId;
  const text = `[${EVENT_INFO.church} ${EVENT_INFO.title}]\n${program.title}\n📅 ${EVENT_INFO.dateShort}\n⏰ ${program.duration} | 참가비 무료\n\n지금 예약하세요! 👇\n${url}`;

  if (navigator.share) {
    navigator.share({
      title: program.title,
      text: text,
      url: url
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showToast('공유 링크가 복사되었습니다!');
    }).catch(() => {
      showToast('링크를 복사할 수 없습니다.');
    });
  }
}

// ---- 프로그램 카드 HTML 생성 ----
function renderProgramCard(program) {
  const instructorHtml = program.instructor
    ? `<div class="card-info-row">
        <span class="label">강사</span>
        <span>${program.instructor} (${program.instructorInfo})</span>
      </div>`
    : '';

  return `
    <div class="program-card" id="card-${program.id}">
      <div class="card-header">
        <h3>${program.emoji} ${program.shortTitle}</h3>
        <span class="duration">${program.duration}</span>
      </div>
      <div class="card-body">
        <p class="description">${program.description}</p>
        <div class="card-info">
          ${instructorHtml}
          <div class="card-info-row">
            <span class="label">참여조건</span>
            <span>${program.ageRequirement}</span>
          </div>
        </div>
        ${program.detailImage ? `<button class="btn-detail" onclick="openDetail('${program.id}')">강사 · 프로그램 상세보기</button>` : ''}
        <div class="card-actions">
          <a href="reserve.html?program=${program.id}" class="btn-reserve">예약하기</a>
          <button class="btn-kakao" onclick="shareKakao('${program.id}')">
            💬 공유
          </button>
        </div>
      </div>
    </div>
  `;
}
