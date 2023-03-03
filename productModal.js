import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.min.js';
import pagination from './pagination.js';

let productModal = '';
let delProductModal = '';

const app = createApp({
    data() {
        return {
            baseUrl: 'https://vue3-course-api.hexschool.io',
            api_path: 'hoganstone',
            products: [],
            tempProduct: {
                imagesUrl: [],
            },
            isNew: true,
            // 儲存分頁資料
            page: {},
        }
    },
    components: {
        pagination,
        productModal,
        delProductModal
    },
    methods: {
        checkLogin() {
            const url = `${this.baseUrl}/v2/api/user/check`;
            axios.post(url)
                .then(res => {
                    this.getProducts();
                })
                .catch(err => {
                    alert(err.data.message);
                    window.location = './index.html';
                })
        },
        getProducts(page = 1) { // 預設參數
            const url = `${this.baseUrl}/v2/api/${this.api_path}/admin/products?page=${page}`;
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
                    this.page = res.data.pagination; // 把分頁資訊存入 page
                })
                .catch(err => {
                    console.log(err.data);
                })
        },
        updateProduct() {
            // 預設為新增產品
            let url = `${this.baseUrl}/v2/api/${this.api_path}/admin/product`;
            let httpMethod = 'post';

            // 當 isNew 為 false 時 = 編輯產品時
            if (!this.isNew) {
                url = `${this.baseUrl}/v2/api/${this.api_path}/admin/product/${this.tempProduct.id}`;
                httpMethod = 'put';
            }

            axios[httpMethod](url, { "data": this.tempProduct })
                .then(res => {
                    alert(res.data.message);
                    productModal.hide();
                    this.getProducts();
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
        deleteProduct(id) {
            const url = `${this.baseUrl}/v2/api/${this.api_path}/admin/product/${id}`;
            axios.delete(url)
                .then(res => {
                    alert(res.data.message);
                    delProductModal.hide();
                    this.getProducts();
                })
                .catch(err => {
                    alert(err.data.message);
                })
        },
        openModal(status, product) {
            if (status === 'delete') {
                this.tempProduct = { ...product };
                delProductModal.show();
            } else if (status === 'edit') {
                this.isNew = false;
                this.tempProduct = { ...product };
                productModal.show();
            } else if (status === 'new') {
                this.isNew = true;
                this.tempProduct = { imagesUrl: [] };
                productModal.show();
            }
        }
    },
    mounted() {
        // 登入驗證
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexschool\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        this.checkLogin();

        // Modal
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    }
})

app.component('product-modal', {
    props: ['tempProduct', 'updateProduct'],
    methods: {
        addImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        }
    },
    template: '#product-modal-template',
})

app.component('delete-product-modal', {
    props: ['tempProduct','deleteProduct'],
    template: '#delete-product-modal-template',
})

app.mount('#app');