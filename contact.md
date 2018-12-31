---
layout: page
title: Contact
---

You can contact me via the contact form or send an email directly at _{{ site.author_email }}_.

<div class="container">  
  <form id="contact" action="" method="POST" action="https://formspree.io/{{site.author_email}}">
    <fieldset>
      <input name="name" placeholder="{{ site.data.ui-text.yourName }}" type="text" tabindex="1" required autofocus>
    </fieldset>
    <fieldset>
      <input name="email" placeholder="{{ site.data.ui-text.yourEmail }}" type="email" tabindex="2" required>
    </fieldset>
    <fieldset>
      <textarea name="message" placeholder="{{ site.data.ui-text.yourMessage }}" tabindex="3" required></textarea>
    </fieldset>
    <fieldset>
      <button type="submit" id="contact-submit" tabindex="4" data-submit="{{ site.data.ui-text.sending }}">{{ site.data.ui-text.submit }}</button>
    </fieldset>
  </form>
</div>