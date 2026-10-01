(function () {
  'use strict';

  // --- Contadores animados ---
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counters = document.querySelectorAll('[data-count]');

  function format(value, decimals) {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function animate(el) {
    var target = parseFloat(el.dataset.count);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = format(target, decimals) + suffix; return; }
    var start = null, duration = 1400;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased, decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  }

  // --- Cérebro interativo ---
  var regions = {
    pfc: {
      title: '1 · Córtex pré-frontal',
      text: 'Região ligada ao planejamento, ao autocontrole e à escolha entre ganho imediato e consequência futura. Em pessoas com jogo problemático, o funcionamento dessa região pode ser diferente, o que dificulta resistir ao impulso de apostar e pesar as perdas.',
      src: 'Fonte: revisões em neurociência do jogo (ver seção Fontes, [4]).'
    },
    reward: {
      title: '2 · Sistema de recompensa (dopamina)',
      text: 'O estriado ventral e o mesencéfalo dopaminérgico respondem a ganhos e à expectativa de ganho. Recompensas imprevisíveis, como numa roleta ou num “jogo do tigrinho”, reforçam o comportamento de forma muito forte, num circuito que também é central na dependência de substâncias.',
      src: 'Fonte: J. Neurosci. 2010; Neuropsychopharmacology 2016 ([4]).'
    },
    nearmiss: {
      title: '3 · Efeito “quase ganhou”',
      text: 'Perder por pouco ativa circuitos semelhantes aos da vitória e aumenta a motivação para continuar apostando. Em apostadores com maior gravidade, a resposta do mesencéfalo e do estriado a esses “quase” é ainda mais intensa. Muitos jogos digitais são desenhados para produzir esse efeito com frequência.',
      src: 'Fonte: PMC2658737; Neuropsychopharmacology 2016 ([4]).'
    }
  };

  var title = document.getElementById('brain-title');
  var text = document.getElementById('brain-text');
  var src = document.getElementById('brain-src');
  var nodes = document.querySelectorAll('#brain .region');

  function select(node) {
    var data = regions[node.dataset.id];
    if (!data) return;
    nodes.forEach(function (n) { n.classList.toggle('active', n === node); });
    title.textContent = data.title;
    text.textContent = data.text;
    src.textContent = data.src;
  }

  nodes.forEach(function (n) {
    n.addEventListener('click', function () { select(n); });
    n.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(n); }
    });
  });
})();
