(() => {
  const form = document.getElementById('idea-form');
  const idea = document.getElementById('idea');
  const requestIdInput = document.getElementById('request-id');
  const button = document.getElementById('submit-button');
  const status = document.getElementById('status');
  let pendingId = null;
  let timeoutId = null;

  function showStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle('error', isError);
  }

  function finish(message, isError) {
    clearTimeout(timeoutId);
    pendingId = null;
    button.disabled = false;
    button.textContent = 'Submit';
    if (!isError) idea.value = '';
    showStatus(message, isError);
  }

  window.addEventListener('message', (event) => {
    let origin;
    try { origin = new URL(event.origin); } catch { return; }
    const trustedHost = origin.hostname === 'script.google.com' ||
      origin.hostname === 'script.googleusercontent.com' ||
      origin.hostname.endsWith('.googleusercontent.com');
    if (origin.protocol !== 'https:' || !trustedHost) return;

    const result = event.data;
    if (!pendingId || !result || result.type !== 'aptamil-submission' || result.requestId !== pendingId) return;
    finish(result.ok ? 'Thank you! Your response has been saved.' : 'Unable to save your response. Please try again.', !result.ok);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (pendingId) return;

    const scriptUrl = (window.APTAMIL_SCRIPT_URL || '').trim();
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(scriptUrl)) {
      showStatus('The form is not connected yet. Please contact the event team.', true);
      return;
    }
    if (!idea.value.trim()) {
      showStatus('Please type your idea before submitting.', true);
      idea.focus();
      return;
    }

    pendingId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    requestIdInput.value = pendingId;
    form.action = scriptUrl;
    button.disabled = true;
    button.textContent = 'Sending…';
    showStatus('Sending your response…');
    form.submit();

    timeoutId = setTimeout(() => {
      if (pendingId) finish('Could not confirm the save. Please check with the event team before trying again.', true);
    }, 45000);
  });
})();
