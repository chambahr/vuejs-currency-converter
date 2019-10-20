new Vue({
	el: "#app",
	data: {
		currencies: {},
		amount: 0,
		from: 'USD',
		to: 'XAF',
		result: 0,
		loading: false
	},
	mounted() {
		this.getCurrencies();
	},
	computed: {
		formattedCurrencies(){
			return 	Object.values(this.currencies);
		},
		calculateResult() {
			return (Number(this.amount) * this.result).toFixed(3);
		},
		disabled() {
			return this.amount === 0 || !this.amount || this.loading;
		}

	},
	methods: {
		getCurrencies() {
			const currencies = localStorage.getItem('currencies')

			if (currencies) {
				this.currencies = JSON.parse(currencies);
				return;
			}

			axios.get("https://free.currconv.com/api/v7/currencies?apiKey=462a3ca8acb7473e494c")

			.then(response => {
				// console.log(response.data.results);
				this.currencies = response.data.results;
				// Ctache the results on the users browser
				localStorage.setItem('currencies', JSON.stringify(response.data.results))
			} );
		},

		convertCurrency() {
			const key = `${this.from}_${this.to}`;
			this.loading = true;
			axios.get(`https://free.currconv.com/api/v7/convert?q=${key}&compact=ultra&apiKey=462a3ca8acb7473e494c`)
			 .then((response) => {
			 	console.log(response)
			 	this.loading = false;
			 	this.result = response.data[key];
			 });
		}
	},
	watch: {
		from() {
			this.result = 0;
		},
		to() {
			this.result = 0;
		} 
	}
})