(function() {
  var id = 'af-widget-' + Date.now();
  var baseUrl = window.AGENTFLOW_BASE_URL || 'https://agentflow-next.netlify.app';
  var agentName = window.AGENTFLOW_AGENT_NAME || 'AgentFlow Chat';
  var flowData = window.AGENTFLOW_FLOW_DATA || '';
  var primaryColor = window.AGENTFLOW_PRIMARY_COLOR || '#4f46e5';

  var container = document.createElement('div');
  container.id = id;
  container.innerHTML = `
    <style>
      #${id} { all: initial; font-family: system-ui, -apple-system, sans-serif; }
      #${id} * { box-sizing: border-box; }
      .af-button {
        position: fixed; bottom: 20px; right: 20px; z-index: 999999;
        width: 56px; height: 56px; border-radius: 50%;
        background: ${primaryColor}; color: white; border: none; cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2); display: flex;
        align-items: center; justify-content: center; transition: transform 0.2s;
      }
      .af-button:hover { transform: scale(1.1); }
      .af-popup {
        position: fixed; bottom: 90px; right: 20px; z-index: 999999;
        width: 360px; height: 520px; border-radius: 16px; overflow: hidden;
        box-shadow: 0 8px 40px rgba(0,0,0,0.15); display: none;
        background: white; border: 1px solid #e2e8f0;
      }
      .af-popup.open { display: block; }
      .af-popup iframe { width: 100%; height: 100%; border: none; }
    </style>
    <button class="af-button" id="af-toggle">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
    <div class="af-popup" id="af-popup">
      <iframe src="${baseUrl}/embed?name=${encodeURIComponent(agentName)}&flow=${encodeURIComponent(flowData)}" allow="microphone"/>
    </div>
  `;
  document.body.appendChild(container);

  var open = false;
  document.getElementById('af-toggle').addEventListener('click', function() {
    open = !open;
    document.getElementById('af-popup').classList.toggle('open', open);
  });
})();
