import CodeRunner from '@/components/CodeRunner'

import React from 'react'

function page() {
  return (
    <>
    
    <CodeRunner language="python" code='print("Hello World!")' />
    
    <CodeRunner 
      language="javascript" 
      code={`console.log("Hello World!");
console.log("This is line 2");
console.log("This is line 3");`} 
    />  
    
    <CodeRunner 
      language="cpp" 
      code={`#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}`} 
    />
  
    </>
  )
}

export default page
