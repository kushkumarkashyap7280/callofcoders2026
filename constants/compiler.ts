export interface Language {
  id: string
  name: string
  version: string
  extensions: string[]
}

export const LANGUAGES: Language[] = [
  { id: 'python', name: 'Python', version: '3.10.0', extensions: ['.py'] },
  { id: 'javascript', name: 'JavaScript', version: '18.15.0', extensions: ['.js'] },
  { id: 'typescript', name: 'TypeScript', version: '5.0.3', extensions: ['.ts'] },
  { id: 'java', name: 'Java', version: '15.0.2', extensions: ['.java'] },
  { id: 'cpp', name: 'C++', version: '10.2.0', extensions: ['.cpp'] },
  { id: 'c', name: 'C', version: '10.2.0', extensions: ['.c'] },
  { id: 'rust', name: 'Rust', version: '1.68.2', extensions: ['.rs'] },
  { id: 'go', name: 'Go', version: '1.16.2', extensions: ['.go'] },
  { id: 'php', name: 'PHP', version: '8.2.3', extensions: ['.php'] },
  { id: 'ruby', name: 'Ruby', version: '3.0.1', extensions: ['.rb'] },
]

export const DEFAULT_CODE: Record<string, string> = {
  python: `# Welcome developers to Call of Coders!
# Free online compiler for learning and testing

print("Welcome to Call of Coders!")
print("Happy coding! 🚀")

def greet(name):
    return f"Hello, {name}! Ready to code?"

print(greet("Developer"))`,
  
  javascript: `// Welcome developers to Call of Coders!
// Free online compiler for learning and testing

console.log("Welcome to Call of Coders!");
console.log("Happy coding! 🚀");

function greet(name) {
    return \`Hello, \${name}! Ready to code?\`;
}

console.log(greet("Developer"));`,
  
  typescript: `// Welcome developers to Call of Coders!
// Free online compiler for learning and testing

console.log("Welcome to Call of Coders!");
console.log("Happy coding! 🚀");

function greet(name: string): string {
    return \`Hello, \${name}! Ready to code?\`;
}

console.log(greet("Developer"));`,
  
  java: `// Welcome developers to Call of Coders!
public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to Call of Coders!");
        System.out.println("Happy coding! 🚀");
        System.out.println(greet("Developer"));
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "! Ready to code?";
    }
}`,
  
  cpp: `// Welcome developers to Call of Coders!
#include <iostream>
#include <string>

std::string greet(std::string name) {
    return "Hello, " + name + "! Ready to code?";
}

int main() {
    std::cout << "Welcome to Call of Coders!" << std::endl;
    std::cout << "Happy coding! 🚀" << std::endl;
    std::cout << greet("Developer") << std::endl;
    return 0;
}`,
  
  c: `// Welcome developers to Call of Coders!
#include <stdio.h>

int main() {
    printf("Welcome to Call of Coders!\\n");
    printf("Happy coding! 🚀\\n");
    printf("Hello, Developer! Ready to code?\\n");
    return 0;
}`,
  
  rust: `// Welcome developers to Call of Coders!
fn main() {
    println!("Welcome to Call of Coders!");
    println!("Happy coding! 🚀");
    println!("{}", greet("Developer"));
}

fn greet(name: &str) -> String {
    format!("Hello, {}! Ready to code?", name)
}`,
  
  go: `// Welcome developers to Call of Coders!
package main

import "fmt"

func greet(name string) string {
    return fmt.Sprintf("Hello, %s! Ready to code?", name)
}

func main() {
    fmt.Println("Welcome to Call of Coders!")
    fmt.Println("Happy coding! 🚀")
    fmt.Println(greet("Developer"))
}`,
  
  php: `<?php
// Welcome developers to Call of Coders!
echo "Welcome to Call of Coders!\\n";
echo "Happy coding! 🚀\\n";

function greet($name) {
    return "Hello, " . $name . "! Ready to code?";
}

echo greet("Developer");
?>`,
  
  ruby: `# Welcome developers to Call of Coders!
puts "Welcome to Call of Coders!"
puts "Happy coding! 🚀"

def greet(name)
    "Hello, #{name}! Ready to code?"
end

puts greet("Developer")`,
}
