/**
 * GLASSMOPHISM ANONYMOUS GUESTBOOK APP JS
 */

const STORAGE_KEY = 'glass_guestbook_entries';
const LIKES_KEY = 'glass_guestbook_user_likes';

// State Management
let guestbookEntries = [];
let userLikes = new Set();
let selectedAvatar = '🚀';
let activeModalState = null; // { type: 'entry'|'reply'|'unlock', action: 'edit'|'delete'|'unlock', entryId, replyId }
let currentFilterSort = {
  search: '',
  sort: 'latest'
};

// Initial Seed Data (Pre-populated when empty)
const SEED_DATA = [
  {
    id: 'entry-seed-1',
    author: '민우',
    avatar: '🎨',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // 'admin' or '1234'
    content: '우연히 방문했는데 글래스모피즘 디자인이 정말 세련되고 예쁘네요! 비밀번호로 익명 작성 및 수정/삭제가 가능해서 든든합니다. 축하드려요 🎉',
    isPrivate: false,
    likes: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    replies: [
      {
        id: 'reply-seed-1-1',
        author: '방장',
        passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
        content: '방문해주셔서 감사합니다 민우님! 좋은 하루 되세요 ☕',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
      }
    ]
  },
  {
    id: 'entry-seed-2',
    author: '시크릿게스트',
    avatar: '👾',
    passwordHash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', // '1234'
    content: '이 글은 비밀글입니다! 작성 시 설정한 비밀번호를 알고 계시다면 해제하여 내용을 확인하실 수 있습니다.',
    isPrivate: true,
    likes: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    replies: []
  },
  {
    id: 'entry-seed-3',
    author: '개발자A',
    avatar: '🚀',
    passwordHash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', // '1234'
    content: '1단계 답글 기능과 반응형 레이아웃이 매끄럽게 잘 동작하네요. 익명으로 자유롭게 소통할 수 있어 참 좋네요!',
    isPrivate: false,
    likes: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    replies: [
      {
        id: 'reply-seed-3-1',
        author: '코더B',
        passwordHash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
        content: '맞아요, 깔끔하고 UX가 인상적입니다!',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString()
      }
    ]
  }
];

// Helper: Hash password using SHA-256
async function hashPassword(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper: Format Time Relative
function formatTimeAgo(isoString) {
  const now = new Date();
  const past = new Date(isoString);
  const diffInSec = Math.floor((now - past) / 1000);

  if (diffInSec < 60) return '방금 전';
  if (diffInSec < 3600) return `${Math.floor(diffInSec / 60)}분 전`;
  if (diffInSec < 86400) return `${Math.floor(diffInSec / 3600)}시간 전`;
  if (diffInSec < 604800) return `${Math.floor(diffInSec / 86400)}일 전`;

  return past.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Toast Helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconClass = 'fa-circle-info';
  if (type === 'success') iconClass = 'fa-circle-check';
  if (type === 'error') iconClass = 'fa-circle-exclamation';

  toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${escapeHTML(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease-in forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Escape HTML for XSS Prevention
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, match => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return map[match];
  });
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  bindEvents();
  renderApp();
});

// Load entries & likes from LocalStorage
function loadData() {
  const storedEntries = localStorage.getItem(STORAGE_KEY);
  if (storedEntries) {
    try {
      guestbookEntries = JSON.parse(storedEntries);
    } catch (e) {
      guestbookEntries = SEED_DATA;
    }
  } else {
    guestbookEntries = SEED_DATA;
    saveData();
  }

  const storedLikes = localStorage.getItem(LIKES_KEY);
  if (storedLikes) {
    try {
      userLikes = new Set(JSON.parse(storedLikes));
    } catch (e) {
      userLikes = new Set();
    }
  }
}

// Save entries to LocalStorage
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guestbookEntries));
  localStorage.setItem(LIKES_KEY, JSON.stringify(Array.from(userLikes)));
}

// Bind DOM Event Listeners
function bindEvents() {
  // Avatar Selection
  const avatarOptions = document.querySelectorAll('.avatar-option');
  avatarOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      avatarOptions.forEach(opt => opt.classList.remove('selected'));
      btn.classList.add('selected');
      selectedAvatar = btn.dataset.avatar;
    });
  });

  // Character Counter
  const contentInput = document.getElementById('contentInput');
  const currentCharCount = document.getElementById('currentCharCount');
  contentInput.addEventListener('input', () => {
    currentCharCount.textContent = contentInput.value.length;
  });

  // New Guestbook Form Submit
  const guestbookForm = document.getElementById('guestbookForm');
  guestbookForm.addEventListener('submit', handleAddEntry);

  // Search & Filter
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const sortSelect = document.getElementById('sortSelect');

  searchInput.addEventListener('input', (e) => {
    currentFilterSort.search = e.target.value.trim().toLowerCase();
    if (currentFilterSort.search.length > 0) {
      clearSearchBtn.classList.remove('hidden');
    } else {
      clearSearchBtn.classList.add('hidden');
    }
    renderFeed();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    currentFilterSort.search = '';
    clearSearchBtn.classList.add('hidden');
    renderFeed();
  });

  sortSelect.addEventListener('change', (e) => {
    currentFilterSort.sort = e.target.value;
    renderFeed();
  });

  // Password Modal Controls
  document.getElementById('closePasswordModalBtn').addEventListener('click', closePasswordModal);
  document.getElementById('cancelPasswordModalBtn').addEventListener('click', closePasswordModal);
  document.getElementById('passwordCheckForm').addEventListener('submit', handlePasswordVerification);

  // Edit Modal Controls
  document.getElementById('closeEditModalBtn').addEventListener('click', closeEditModal);
  document.getElementById('cancelEditModalBtn').addEventListener('click', closeEditModal);
  document.getElementById('editForm').addEventListener('submit', handleSaveEdit);
}

// Handle Add Guestbook Entry
async function handleAddEntry(e) {
  e.preventDefault();

  const author = document.getElementById('authorInput').value.trim();
  const password = document.getElementById('passwordInput').value.trim();
  const content = document.getElementById('contentInput').value.trim();
  const isPrivate = document.getElementById('isPrivateCheckbox').checked;

  if (!author || !password || !content) {
    showToast('모든 항목을 올바르게 입력해주세요.', 'error');
    return;
  }

  if (password.length < 4) {
    showToast('비밀번호는 최소 4자리 이상이어야 합니다.', 'error');
    return;
  }

  const passwordHash = await hashPassword(password);

  const newEntry = {
    id: `entry-${Date.now()}`,
    author: author,
    avatar: selectedAvatar,
    passwordHash: passwordHash,
    content: content,
    isPrivate: isPrivate,
    unlocked: false, // Session unlock state
    likes: 0,
    createdAt: new Date().toISOString(),
    replies: []
  };

  guestbookEntries.unshift(newEntry);
  saveData();

  // Reset Form
  document.getElementById('guestbookForm').reset();
  document.getElementById('currentCharCount').textContent = '0';
  
  renderApp();
  showToast('소중한 방명록이 성공적으로 등록되었습니다!', 'success');
}

// Render Full App (Stats & Feed)
function renderApp() {
  renderStats();
  renderFeed();
}

// Render Stats Header
function renderStats() {
  const totalEntries = guestbookEntries.length;
  const totalLikes = guestbookEntries.reduce((acc, curr) => acc + (curr.likes || 0), 0);

  document.getElementById('totalEntriesCount').textContent = totalEntries;
  document.getElementById('totalLikesCount').textContent = totalLikes;
}

// Render Filtered & Sorted Feed
function renderFeed() {
  const feedContainer = document.getElementById('entriesFeed');
  const emptyState = document.getElementById('emptyState');
  feedContainer.innerHTML = '';

  let filtered = guestbookEntries.filter(entry => {
    if (!currentFilterSort.search) return true;
    const matchAuthor = entry.author.toLowerCase().includes(currentFilterSort.search);
    const matchContent = entry.content.toLowerCase().includes(currentFilterSort.search);
    return matchAuthor || matchContent;
  });

  // Sort
  if (currentFilterSort.sort === 'latest') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (currentFilterSort.sort === 'oldest') {
    filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (currentFilterSort.sort === 'popular') {
    filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  filtered.forEach(entry => {
    const card = createEntryCardElement(entry);
    feedContainer.appendChild(card);
  });
}

// Create DOM Element for Guestbook Entry Card
function createEntryCardElement(entry) {
  const card = document.createElement('div');
  card.className = `glass-card entry-card ${entry.isPrivate ? 'is-private' : ''}`;
  card.dataset.id = entry.id;

  const isLiked = userLikes.has(entry.id);
  const timeAgo = formatTimeAgo(entry.createdAt);

  // Private Post Logic
  let contentHTML = '';
  if (entry.isPrivate && !entry.unlocked) {
    contentHTML = `
      <div class="secret-mask">
        <i class="fa-solid fa-lock"></i>
        <p>비밀글입니다. 작성 시 입력한 비밀번호로 내용을 확인할 수 있습니다.</p>
        <button class="btn btn-secondary btn-sm" onclick="openPasswordModal('unlock', '${entry.id}')">
          <i class="fa-solid fa-key"></i> 비밀번호 입력하여 보기
        </button>
      </div>
    `;
  } else {
    contentHTML = `<div class="entry-content">${escapeHTML(entry.content)}</div>`;
  }

  // Replies List HTML
  const replyCount = entry.replies ? entry.replies.length : 0;
  let repliesHTML = '';
  if (entry.replies && entry.replies.length > 0) {
    repliesHTML = entry.replies.map(reply => `
      <div class="reply-item" data-reply-id="${reply.id}">
        <div class="reply-header">
          <div class="reply-author">
            <i class="fa-solid fa-reply"></i>
            <span>${escapeHTML(reply.author)}</span>
          </div>
          <div class="reply-actions">
            <span class="reply-time">${formatTimeAgo(reply.createdAt)}</span>
            <button class="btn-icon-action" onclick="openPasswordModal('editReply', '${entry.id}', '${reply.id}')" title="답글 수정">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn-icon-action" onclick="openPasswordModal('deleteReply', '${entry.id}', '${reply.id}')" title="답글 삭제">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="reply-content">${escapeHTML(reply.content)}</div>
      </div>
    `).join('');
  }

  card.innerHTML = `
    <div class="entry-header">
      <div class="author-info">
        <div class="avatar-badge">${entry.avatar || '🚀'}</div>
        <div>
          <div class="author-name">
            <span>${escapeHTML(entry.author)}</span>
            ${entry.isPrivate ? '<span class="private-indicator"><i class="fa-solid fa-lock"></i> 비밀글</span>' : ''}
          </div>
          <span class="entry-time">${timeAgo}</span>
        </div>
      </div>

      <div class="entry-actions">
        <button class="btn-icon-action" onclick="openPasswordModal('editEntry', '${entry.id}')" title="글 수정">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn-icon-action" onclick="openPasswordModal('deleteEntry', '${entry.id}')" title="글 삭제">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>

    ${contentHTML}

    <div class="entry-footer">
      <div class="footer-left">
        <button class="btn btn-like ${isLiked ? 'liked' : ''}" onclick="toggleLike('${entry.id}')">
          <i class="fa-${isLiked ? 'solid' : 'regular'} fa-heart"></i>
          <span>${entry.likes || 0}</span>
        </button>
        
        <button class="btn btn-secondary btn-sm" onclick="toggleRepliesSection('${entry.id}')">
          <i class="fa-regular fa-comment-dots"></i>
          <span>답글 ${replyCount}개</span>
        </button>
      </div>
    </div>

    <!-- Replies Container (Default Hidden until toggled or if has replies) -->
    <div class="replies-container hidden" id="replies-${entry.id}">
      <form class="reply-form" onsubmit="handleAddReply(event, '${entry.id}')">
        <div class="reply-form-row">
          <input type="text" class="glass-input reply-author-input" placeholder="닉네임" required maxlength="10">
          <input type="password" class="glass-input reply-password-input" placeholder="비밀번호" required minlength="4">
        </div>
        <textarea class="glass-textarea reply-content-input" placeholder="답글을 남겨주세요..." rows="2" required></textarea>
        <div class="reply-form-footer">
          <button type="submit" class="btn btn-primary btn-sm">
            <span>답글 작성</span>
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </form>

      <div class="reply-list">
        ${repliesHTML}
      </div>
    </div>
  `;

  return card;
}

// Toggle Reply Section Accordion
function toggleRepliesSection(entryId) {
  const container = document.getElementById(`replies-${entryId}`);
  if (container) {
    container.classList.toggle('hidden');
  }
}

// Toggle Like Reaction
function toggleLike(entryId) {
  const entry = guestbookEntries.find(e => e.id === entryId);
  if (!entry) return;

  if (userLikes.has(entryId)) {
    userLikes.delete(entryId);
    entry.likes = Math.max(0, (entry.likes || 1) - 1);
    showToast('공감을 취소했습니다.', 'info');
  } else {
    userLikes.add(entryId);
    entry.likes = (entry.likes || 0) + 1;
    showToast('글에 공감했습니다! ❤️', 'success');
  }

  saveData();
  renderApp();
}

// Handle Add Reply
async function handleAddReply(event, entryId) {
  event.preventDefault();
  const form = event.target;
  const authorInput = form.querySelector('.reply-author-input');
  const passwordInput = form.querySelector('.reply-password-input');
  const contentInput = form.querySelector('.reply-content-input');

  const author = authorInput.value.trim();
  const password = passwordInput.value.trim();
  const content = contentInput.value.trim();

  if (!author || !password || !content) return;

  const entry = guestbookEntries.find(e => e.id === entryId);
  if (!entry) return;

  const passwordHash = await hashPassword(password);

  const newReply = {
    id: `reply-${Date.now()}`,
    author: author,
    passwordHash: passwordHash,
    content: content,
    createdAt: new Date().toISOString()
  };

  if (!entry.replies) entry.replies = [];
  entry.replies.push(newReply);

  saveData();
  renderApp();

  // Keep reply container open after adding
  const container = document.getElementById(`replies-${entryId}`);
  if (container) container.classList.remove('hidden');

  showToast('답글이 작성되었습니다.', 'success');
}

// Modal Trigger Handler
function openPasswordModal(actionType, entryId, replyId = null) {
  activeModalState = { actionType, entryId, replyId };

  const modal = document.getElementById('passwordModal');
  const title = document.getElementById('modalTitle');
  const desc = document.getElementById('modalDescription');
  const input = document.getElementById('modalPasswordInput');
  const errorMsg = document.getElementById('passwordErrorMsg');

  input.value = '';
  errorMsg.classList.add('hidden');

  if (actionType === 'editEntry') {
    title.textContent = '방명록 수정';
    desc.textContent = '글 작성 시 설정했던 비밀번호를 입력해주세요.';
  } else if (actionType === 'deleteEntry') {
    title.textContent = '방명록 삭제';
    desc.textContent = '삭제하려면 글 작성 시 비밀번호를 입력해주세요.';
  } else if (actionType === 'unlock') {
    title.textContent = '비밀글 잠금 해제';
    desc.textContent = '비밀글 작성을 위한 비밀번호를 입력해주세요.';
  } else if (actionType === 'editReply') {
    title.textContent = '답글 수정';
    desc.textContent = '답글 작성 시 설정했던 비밀번호를 입력해주세요.';
  } else if (actionType === 'deleteReply') {
    title.textContent = '답글 삭제';
    desc.textContent = '삭제하려면 답글 작성 시 비밀번호를 입력해주세요.';
  }

  modal.classList.remove('hidden');
  input.focus();
}

function closePasswordModal() {
  document.getElementById('passwordModal').classList.add('hidden');
  activeModalState = null;
}

// Password Verification Logic
async function handlePasswordVerification(e) {
  e.preventDefault();

  if (!activeModalState) return;
  const inputPassword = document.getElementById('modalPasswordInput').value.trim();
  const errorMsg = document.getElementById('passwordErrorMsg');

  if (!inputPassword) return;

  const inputHash = await hashPassword(inputPassword);
  const entry = guestbookEntries.find(e => e.id === activeModalState.entryId);

  if (!entry) {
    closePasswordModal();
    return;
  }

  // Determine Target & Password Hash to check
  let targetPasswordHash = '';
  let replyObj = null;

  if (activeModalState.actionType.includes('Reply')) {
    replyObj = entry.replies.find(r => r.id === activeModalState.replyId);
    if (replyObj) targetPasswordHash = replyObj.passwordHash;
  } else {
    targetPasswordHash = entry.passwordHash;
  }

  // Check Hash Match
  if (inputHash !== targetPasswordHash) {
    errorMsg.classList.remove('hidden');
    return;
  }

  // Hash Verified! Perform Action
  const { actionType, entryId, replyId } = activeModalState;
  closePasswordModal();

  if (actionType === 'deleteEntry') {
    guestbookEntries = guestbookEntries.filter(e => e.id !== entryId);
    saveData();
    renderApp();
    showToast('방명록이 삭제되었습니다.', 'info');
  } else if (actionType === 'deleteReply') {
    entry.replies = entry.replies.filter(r => r.id !== replyId);
    saveData();
    renderApp();
    showToast('답글이 삭제되었습니다.', 'info');
  } else if (actionType === 'unlock') {
    entry.unlocked = true;
    renderApp();
    showToast('비밀글 잠금이 해제되었습니다.', 'success');
  } else if (actionType === 'editEntry' || actionType === 'editReply') {
    openEditModal(actionType, entryId, replyId);
  }
}

// Edit Modal Handler
let currentEditState = null;

function openEditModal(actionType, entryId, replyId) {
  currentEditState = { actionType, entryId, replyId };
  const modal = document.getElementById('editModal');
  const textarea = document.getElementById('editContentInput');

  const entry = guestbookEntries.find(e => e.id === entryId);
  if (!entry) return;

  if (actionType === 'editEntry') {
    textarea.value = entry.content;
  } else if (actionType === 'editReply') {
    const reply = entry.replies.find(r => r.id === replyId);
    if (reply) textarea.value = reply.content;
  }

  modal.classList.remove('hidden');
  textarea.focus();
}

function closeEditModal() {
  document.getElementById('editModal').classList.add('hidden');
  currentEditState = null;
}

function handleSaveEdit(e) {
  e.preventDefault();
  if (!currentEditState) return;

  const newContent = document.getElementById('editContentInput').value.trim();
  if (!newContent) {
    showToast('내용을 입력해주세요.', 'error');
    return;
  }

  const { actionType, entryId, replyId } = currentEditState;
  const entry = guestbookEntries.find(e => e.id === entryId);

  if (entry) {
    if (actionType === 'editEntry') {
      entry.content = newContent;
      showToast('방명록이 수정되었습니다.', 'success');
    } else if (actionType === 'editReply') {
      const reply = entry.replies.find(r => r.id === replyId);
      if (reply) reply.content = newContent;
      showToast('답글이 수정되었습니다.', 'success');
    }
    saveData();
    renderApp();
  }

  closeEditModal();
}
