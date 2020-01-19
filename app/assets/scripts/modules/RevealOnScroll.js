import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

class RevealOnSCroll {
    constructor(els, thresholdPercent) {
        this.thresholdPercent = thresholdPercent
        this.itemsToReveal = els
        //We added the element in app.js so all we do is setup a parameter and set it equal to the parameter
        // this.itemsToReveal = document.querySelectorAll(".feature-item")
        this.browserHeight = window.innerHeight
        this.hideInitially()
        this.scrollThrottle = throttle(this.calcCaller, 200).bind(this)
        this.events()
    }

    events() {
        window.addEventListener("scroll", this.scrollThrottle)
        window.addEventListener("resize", debounce(() => {
            console.log("Resize just ran")
            this.browserHeight = window.innerHeight
        }, 333))
    }

    calcCaller() {
        console.log("Scroll function ran")
        this.itemsToReveal.forEach( el => {
            if (el.isRevealed == false) {
                this.calculateIfScrolledTo(el)
            }
        })
    }

    calculateIfScrolledTo(el) {
        if (window.scrollY + window.innerHeight > el.offsetTop) {
            console.log("Element was calculated")
            let scrollPercent = (el.getBoundingClientRect().top / window.innerHeight) * 100
            if (scrollPercent < this.thresholdPercent) {
                el.classList.add("reveal-item--is-visible")
                el.isRevealed = true
                if (el.isLastItem) {
                    window.removeEventListener("scroll", this.scrollThrottle)
                }
            }
        }
    }

    hideInitially() {
        //you can get rid {} if there is only one function
        //arrow function shorten from function(el) to (el =>)
        this.itemsToReveal.forEach(el =>  {
            el.classList.add("reveal-item")
            el.isRevealed = false
        })
        //.length is how many item are in the collection
        this.itemsToReveal[this.itemsToReveal.length - 1].isLastItem = true
    }
}

export default RevealOnSCroll