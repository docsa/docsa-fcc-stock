# docsa-fcc-stock

## ISQA_5 - Nasdaq Stock Price Checker

### User Stories

1.  Set the content security policies to only allow loading of scripts and css from your server.
2.  I can  **GET**  `/api/stock-prices`  with form data containing a Nasdaq  _stock_  ticker and recieve back an object  _stockData_.
3.  In  _stockData_, I can see the  _stock_(string, the ticker),  _price_(decimal in string format), and  _likes_(int).
4.  I can also pass along field  _like_  as  **true**(boolean) to have my like added to the stock(s). Only 1 like per ip should be accepted.
5.  If I pass along 2 stocks, the return object will be an array with both stock's info but instead of  _likes_, it will display  _rel_likes_(the difference between the likes on both) on both.
6.  A good way to receive current price is the following external API(replacing 'GOOG' with your stock):  `https://finance.google.com/finance/info?q=NASDAQ%3aGOOG`
7.  All 5 functional tests are complete and passing.

### Example usage:

`/api/stock-prices?stock=goog`  
`/api/stock-prices?stock=goog&like=true`  
`/api/stock-prices?stock=goog&stock=msft`  
`/api/stock-prices?stock=goog&stock=msft&like=true`  

### Example return:
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTYxOTY3OTY5M119
-->