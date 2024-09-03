
let timeout;

let haetiedot = () => {
/* haetaan tarkennettu valintalista palvelimelta,
   ja näytetään se uutena valintalistana */
}

const tarkenna = () => {
if (timeout) clearTimeout(timeout);    
timeout = setTimeout(haetiedot,2000);    
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('form').onsubmit = e => {

        /* e.preventDefault(); */

        /* Huom. vaihda oma APIKEY alla olevan tilalle, se ei toimi. */
        const APIKEY = "gaxLoCRfgEfyRnnNwKTlN3rYjS7LQFHY";
        //const SPSALASANA = "dummypass";
      
        let form = document.querySelector("#lomake");
        let data = new FormData(form);
        let dataObj = Object.fromEntries(data.entries());
        let params = new URLSearchParams(dataObj).toString();

        console.log("dataObj:",dataObj);
        console.log("params:",params);
        
        var myHeaders = new Headers();
        myHeaders.append("apikey", APIKEY);

         requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };

		console.log('Tiedot haetaan..');
        let result = document.querySelector('#result');
		result.innerHTML = 'Tietoja haetaan..';

        //fetch(`https://api.apilayer.com/exchangerates_data/latest?${params}`, requestOptions)
        /* Ei tarvitse API Keytä: https://open.er-api.com/v6/latest/eur */
        /* https://api.boffsaopendata.fi/referencerates/api/ExchangeRate?eur */
        fetch('https://api.boffsaopendata.fi/referencerates/api/ExchangeRate', {
                method: 'GET',
                // Request headers
                headers: {
                    'Cache-Control': 'no-cache',
                    'Ocp-Apim-Subscription-Key': SPSALASANA }
            })
            .then(response => {
                console.log(response.status);
                console.log(response.text());
            })
            .catch(err => console.error(err));
        
        const url = 'https://api.apilayer.com/exchangerates_data/latest?' + params;
        fetch(url,requestOptions)
        .then(response => response.json())
        .then(data => {
            // Get currency from user input and convert to upper case
            const currency = document.querySelector('#currency').value.toUpperCase();
            console.log("rates,NOK:",data.rates['NOK']);
            /* check undefined, raise error if undefined */
            if (typeof data.rates == 'undefined') {
                throw new Error('Undefined rates');
                }
            let valuutat = Object.entries(data.rates);
            console.log("valuutat:",valuutat);

            /* TEHTÄVÄ: Listaa valuuttakurssit ul elementtiin result
            Object.entries(obj).forEach(([key, value]) => ..
            */
           
            if (valuutat.length > 0) {
                let list = document.createElement('ul');
                list.style.listStyleType = "none";
                list.style.paddingLeft = "0px";

                /* Display list of currencies on the screen, huom.
                   myös data.rates toimisi suoraan. */
                valuutat.forEach(currency => {
                    let listItem = document.createElement('li');
                    listItem.innerHTML = `${currency[0]} ${currency[1]}`;
                    console.log("listItem:",listItem);
                    list.appendChild(listItem);
                    })

                result.innerHTML = "List of currencies:";
                result.appendChild(list);    
                }

            else {
                // Get rate from data
                const rate = data.rates[currency];

                // Check if currency is valid:
                if (rate !== undefined) {
                // Get number of rates in data.rates object
                                  
                    // Display exchange on the screen
                    document.querySelector('#result').innerHTML = `1 ${dataObj.base} is equal to ${rate.toFixed(3)} ${currency}.`;
                    }

                else {
                    // Display error on the screen
                    document.querySelector('#result').innerHTML = 'Invalid Currency.';
                    }
                }
            })
            // Catch any errors and log them to the console
        .catch(error => {
            console.log('Error:', error);
            });
        // Prevent default submission
        return false;
    }
});
