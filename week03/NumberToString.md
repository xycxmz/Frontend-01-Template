 function numberToString (number, x) {
   let int = Math.floor(number)
   let string = ''
   while (int > 0) {
     string = String(int % x) + string
     int = Math.floor(int / x)
   }
   return string;
 }
