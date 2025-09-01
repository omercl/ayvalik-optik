import { $, on } from '../core/dom.js';

const showStatus = (statusEl, msg, ok = true) => {
  if (!statusEl) return;
  statusEl.hidden = false;
  statusEl.textContent = msg;
  statusEl.classList.remove('is-error', 'is-ok');
  statusEl.classList.add(ok ? 'is-ok' : 'is-error');
};

const setFieldError = (input, hasError = false) => {
  if (!input) return;
  input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  const field = input.closest('.field') || input.closest('label')?.closest('.field');
  if (field) {
    field.classList.toggle('is-invalid', !!hasError);
  }
};

const isValidEmail = (v) => {
  if (!v) return false;
  const s = String(v).trim();
  if (s.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
};

const isValidTRMobile = (v) => {
  return /^05\d{9}$/.test(String(v).trim());
};

const validateForm = (root = document) => {
  let firstInvalid = null;
  let valid = true;

  const firstName = root.querySelector('#firstName');
  const lastName = root.querySelector('#lastName');
  const emailEl = root.querySelector('#email');
  const topic = root.querySelector('#topic');
  const message = root.querySelector('#message');
  const phoneEl = root.querySelector('#phone');

  if (firstName) {
    const ok = firstName.value.trim().length > 0;
    setFieldError(firstName, !ok);
    if (!ok && !firstInvalid) firstInvalid = firstName;
    valid = valid && ok;
  }

  if (lastName) {
    const ok = lastName.value.trim().length > 0;
    setFieldError(lastName, !ok);
    if (!ok && !firstInvalid) firstInvalid = lastName;
    valid = valid && ok;
  }

  if (emailEl) {
    const v = emailEl.value.trim();
    const ok = v.length > 0 && isValidEmail(v);
    setFieldError(emailEl, !ok);
    if (!ok && !firstInvalid) firstInvalid = emailEl;
    valid = valid && ok;
  }

  if (topic) {
    const ok = topic.value.trim().length > 0;
    setFieldError(topic, !ok);
    if (!ok && !firstInvalid) firstInvalid = topic;
    valid = valid && ok;
  }

  if (message) {
    const ok = message.value.trim().length > 0;
    setFieldError(message, !ok);
    if (!ok && !firstInvalid) firstInvalid = message;
    valid = valid && ok;
  }

  if (phoneEl) {
    const v = phoneEl.value.trim();
    const ok = !v || isValidTRMobile(v);
    setFieldError(phoneEl, !ok);
    if (!ok && !firstInvalid) firstInvalid = phoneEl;
    valid = valid && ok;
  }

  if (!valid && firstInvalid) {
    firstInvalid.focus({ preventScroll: false });
    const field = firstInvalid.closest('.field');
    if (field) {
      field.classList.add('shake');
      setTimeout(() => field.classList.remove('shake'), 400);
    }
  }

  return valid;
};

export function init() {
  const form = $('#contactForm');
  if (!form) return;
  if (form.dataset.bound === '1') return;
  form.dataset.bound = '1';

  const statusEl = $('#form-status');
  const emailEl = $('#email');
  const replytoHidden = $('#replytoHidden');
  const phoneEl = $('#phone');

  if (phoneEl) {
    phoneEl.addEventListener('input', () => {
      let val = phoneEl.value.replace(/\D/g, ''); // sadece rakamlar

      // Eğer kullanıcı hepsini sildiyse → input boş bırak
      if (val === '') {
        phoneEl.value = '';
        setFieldError(phoneEl, false);
        return;
      }

      // Başta 0 yoksa ekle
      if (!val.startsWith('0')) {
        val = '0' + val;
      }

      // 11 hane sınırı
      val = val.slice(0, 11);
      phoneEl.value = val;

      const ok = isValidTRMobile(val);
      setFieldError(phoneEl, !ok);
    });

    phoneEl.addEventListener('blur', () => {
      const v = phoneEl.value.trim();
      if (!v) {
        setFieldError(phoneEl, false);
      } else {
        setFieldError(phoneEl, !isValidTRMobile(v));
      }
    });
  }

  on(form, 'submit', async (e) => {
    e.preventDefault();

    const ok = validateForm(form);
    if (!ok) return;

    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value) return;

    if (replytoHidden && emailEl) replytoHidden.value = emailEl.value;

    const formData = new FormData(form);

    const btn = form.querySelector('button[type="submit"]');
    const originalBtnText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerText = 'Gönderiliyor…';
    }

    try {
      const res = await fetch(form.action, {
        method: form.method || 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        showStatus(statusEl, 'Teşekkürler! Mesajın ulaştı. En kısa sürede dönüş yapacağız.', true);
        form.reset();
        form.querySelectorAll('.field.is-invalid').forEach((f) => f.classList.remove('is-invalid'));
        form
          .querySelectorAll("[aria-invalid='true']")
          .forEach((el) => el.setAttribute('aria-invalid', 'false'));
      } else {
        let msg = 'Bir hata oluştu. Daha sonra tekrar dene veya telefonla ulaş.';
        try {
          const data = await res.json();
          if (data && data.error) msg = data.error;
        } catch (err) {
          void err;
        }
        showStatus(statusEl, msg, false);
      }
    } catch {
      showStatus(statusEl, 'Ağ hatası: İnternet bağlantını kontrol et.', false);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalBtnText;
      }
    }
  });
}
