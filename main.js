Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
  <div class="product">

  <div class="product-image">
    <img v-bind:src="image">
  </div>
  <div class="product-info">
    <h1>{{title}}</h1>
    <p v-if="inStock">In Stock</p>
    <p v-else>Out of Stock</p>
    <p>Shipping: {{shipping}}</p>

    <p v-if="onSale">{{onSaleMessage}}</p>

    <productDetails :details="details"></productDetails>


    <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box"
      :style="{backgroundColor: variant.variantColor}" @mouseover="updateProduct(index)">
    </div>

    <button @click="addToCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Add to Cart</button>
    <br />
    <button v-on:click="subtractFromCart">Subtract from Cart</button>

  </div>

  <div>
    <h2>Reviews</h2>
    <p v-if="!reviews.length">There are no reviews yet.</p>
    <ul>
      <li v-for="review in reviews">
        <p>{{review.name}}</p>
        <p>Rating: {{review.rating}}</p>
        <p>{{review.review}}</p>
        <p>Would You Reccomend?: {{review.wouldReccomend}}</p>
      </li>
    </ul>
  </div>

  <product-review @review-submitted="addReview"></product-review>

</div>
`,
  data() {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      onSale: true,
      selectedVariant: 0,
      details: ['80% cotton', '20% polyester', 'Gender-neutral'],
      variants: [
        {
          variantId: 2234,
          variantColor: 'green',
          variantImage: './assets/vmSocks-green-onWhite.jpg',
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage: './assets/vmSocks-blue-onWhite.jpg',
          variantQuantity: 0
        }
      ],
      reviews: []
    }
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    subtractFromCart() {
      this.$emit('subtract-from-cart', this.variants[this.selectedVariant].variantId)
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
    addReview(productReview) {
      this.reviews.push(productReview);
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    onSaleMessage() {
      if (this.onSale) return this.title + ' is on sale!';
    },
    shipping() {
      return this.premium ? 'free' : '$2.99';
    }
  }
})

Vue.component('productDetails', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">{{detail}}</li>
    </ul>
  `
})

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{error}}</li>
        </ul>
      </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>

      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>
        <label for="reccomend">Would You Reccomend This Product?</label>
        <div class="yes-or-no">
          <input v-model="wouldReccomend" type="radio" name="reccomend" value="Yes">Yes</input>
          <input v-model="wouldReccomend" type="radio" name="reccomend" value="No">No</input>
        </div>
      </p>

      <p>
        <input type="submit" value="Submit">
      </p>

    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      wouldReccomend: null,
      errors: []
    }
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating && this.wouldReccomend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          wouldReccomend: this.wouldReccomend
        }
        this.$emit('review-submitted', productReview);
        this.errors = [];
        this.name = null;
        this.review = null;
        this.rating = null;
        this.wouldReccomend = null;
      } else {
        if (!this.name) this.errors.push('Name Required');
        if (!this.review) this.errors.push('Review Required');
        if (!this.rating) this.errors.push('Rating Required');
        if (!this.wouldReccomend) this.errors.push('Reccomendation Required')
      }
    }
  }
})

const app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    },
    removeItem(id) {
      this.cart = this.cart.filter(element => {
        return element !== id;
      })
    }
  }
})
