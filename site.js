/* TrueRead site — nav behavior + demo form validation */
(function(){
  // Sticky nav: shadow on scroll
  var nav = document.querySelector('.nav');
  if(nav){
    var onScroll = function(){ nav.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
    // Mobile menu toggle
    var toggle = nav.querySelector('.nav-toggle');
    if(toggle){ toggle.addEventListener('click', function(){ nav.classList.toggle('open'); }); }
  }

  // Number tick-up on the homepage dashboard when it scrolls into view
  var counted = false;
  function tick(el){
    var target = parseFloat(el.getAttribute('data-value'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var start = performance.now(), dur = 400;
    function frame(now){
      var t = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      var v = target * eased;
      el.textContent = prefix + v.toLocaleString('en-US', {minimumFractionDigits:decimals, maximumFractionDigits:decimals}) + suffix;
      if(t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var dash = document.querySelector('[data-countup-group]');
  if(dash && 'IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting && !counted){
          counted = true;
          document.querySelectorAll('[data-value]').forEach(tick);
        }
      });
    }, {threshold:0.35});
    io.observe(dash);
  }

  // Demo form validation
  var form = document.querySelector('#demo-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[data-required]').forEach(function(input){
        var field = input.closest('.field');
        var val = (input.value || '').trim();
        var valid = val.length > 0;
        if(input.type === 'email') valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
        field.classList.toggle('err', !valid);
        if(!valid) ok = false;
      });
      if(ok){
        var card = document.querySelector('#form-wrap');
        card.innerHTML = '<div class="form-success"><div class="caption" style="color:var(--cyan);margin-bottom:16px">Request received</div>'
          + '<h3 style="font-size:24px;margin-bottom:12px">We\u2019ll be in touch by end of day.</h3>'
          + '<p class="body" style="max-width:420px">A human reads every request. Expect a note from a TrueRead operator with a couple of times to walk through a demo shaped like your business.</p></div>';
      }
    });
    // clear error on input
    form.querySelectorAll('[data-required]').forEach(function(input){
      input.addEventListener('input', function(){ input.closest('.field').classList.remove('err'); });
      input.addEventListener('change', function(){ input.closest('.field').classList.remove('err'); });
    });
  }
})();
