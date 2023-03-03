import  productModal from "./productModal.js";
const { createApp } = Vue;

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'hironakavue';

VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('required', VeeValidateRules['required']);
VeeValidate.defineRule('min', VeeValidateRules['min']);
VeeValidate.defineRule('max', VeeValidateRules['max']);

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true,
});


const app = createApp({
  data(){
    return {
      products: [],
      product: {},
      cart: {},
      form:{
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      loadingItem: ''
    }
  },

  methods: {
    getProducts(){
      axios.get(`${ apiUrl }/v2/api/${ apiPath }/products/all`)
        .then( res => {
          this.products = res.data.products;
        })
        .catch( err => {
          alert( err.response.data.message );
        })
    },

    getProduct(id){
      this.loadingItem = id;
      axios.get(`${ apiUrl }/v2/api/${ apiPath }/product/${id}`)
        .then( res => {
          this.loadingItem = '';
          this.product = res.data.product;
          this.$refs.productModal.openModal();
        })
        .catch( err => {
          alert( err.response.data.message );
        })
    },

    addToCart(product_id, qty = 1 ){
      const cartData = {
        data: {
          product_id,
          qty
        }
      };
      this.loadingItem = product_id;
      axios.post(`${ apiUrl }/v2/api/${ apiPath }/cart/`, cartData)
        .then( res => {
          this.$refs.productModal.hideModal();
          alert( res.data.message );
          this.loadingItem = '';
          this.getCart();
        })
        .catch( err => {
          alert( err.response.data.message );
        })
    },

    getCart(){
      axios.get(`${ apiUrl }/v2/api/${ apiPath }/cart/`)
        .then( res => {
          this.cart = res.data.data;
        })
        .catch( err => {
          alert( err.response.data.message );
        })
    },

    removeCartItem(id){
      this.loadingItem = id;
      axios.delete(`${ apiUrl }/v2/api/${ apiPath }/cart/${ id }`)
        .then( res => {
          alert( res.data.message );
          this.loadingItem = '';
          this.getCart();
        })
        .catch( err => {
          alert( err.response.data.message );
        })
    },

    deleteAllCarts(){
      axios.delete(`${ apiUrl }/v2/api/${ apiPath }/carts`)
        .then( res => {
          alert( res.data.message );
          this.getCart();
        })
        .catch( err => {
          alert( err.data.message );
        })
    },

    updateCart( data ){
      this.loadingItem = data.id;
      const cart = {
        data: {
          "product_id": data.product_id,
          "qty": data.qty
        }
      }

      axios.put(`${ apiUrl }/v2/api/${ apiPath }/cart/${ data.id }`, cart)
        .then( res => {
          alert( res.data.message );
          this.loadingItem = '';
          this.getCart();
        })
        .catch( err => {
          alert( err.response.data.message );
        })
    },

    sendOrder(){
      const order = {
        data: this.form
      };
      console.log(order);
      axios.post(`${ apiUrl }/v2/api/${ apiPath }/order`, order)
        .then( res => {
          alert( res.data.message );
          this.$refs.form.resetForm();
          this.getCart();
        })
        .catch( err => {
          alert( err.response.data.message );
        })
    }
  },

  mounted(){
    this.getProducts();
    this.getCart();
  },


});

app.component('productModal', productModal);
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');



 
