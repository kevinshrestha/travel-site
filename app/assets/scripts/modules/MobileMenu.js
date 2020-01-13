class MobileMenu {
  constructor() {
    //clean
    this.menuIcon = document.querySelector(".site-header__menu-icon")
  }
  //messy
  // document.querySelector(".site-header__menu-icon").addEventListener("click", function () {
  //   console.log("The top right icon was clicked.");
  // }) 

  // arrow function, it does not manipulate the value of the keyword.
  // event listener is not receiving a direct reference to our method
  // instead we're passing out event listen arrow function that it's going to call 
  // and then it's our arrow function that will execute "toggleTheMenu"
  // since an arrow funciton does not manipulate "this" keyword
  events() {
    this.menuIcon.addEventListener("click", () => this.toggleTheMenu())
    // if we did not provide an arrow function, instead listed a direct reference to toggle
    // then addEventListener would hae ran the code below within a context where it would be
    // pointing towards the elements that got clicked on
    // because we provided and arrow function, "this" keyboard doesn't change
  }
  // when this code runs the "this" keyword, it will still be pointing towards our overall object
  toggleTheMenu() {
    // when this line of code runs, this is still pointing towards our overall object
    // which lets us easily access our menu content property
    this.menuContent.classList.toggle("site-header__menu-content--is-visible")
  }

}

export default MobileMenu