let acc = document.getElementsByClassName("title-accordion");
let i;

const acordion3 = document.getElementById("3-accordion");

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}


acordion3.addEventListener('click',function(){
  acordion3.classList.toggle('no-border')
})