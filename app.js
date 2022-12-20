// Book Class
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
// UI Class: Handle UI Tasks
class UI {
    static displayBooks(){

        const books = Store.getBooks();
        // yukarıdaki 2 kitabı arraya atarak içinde dönerek fonksiyona gönderdik
        books.forEach((book) => UI.addBookList(book));
    }


    static addBookList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.prepend(row);
    }

    static deleteBook(target){
        if(target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();      
          }
    }

    static showAlert(message, type){
        const div = document.createElement('div');
        div.className = `alert alert-${type}`;
        div.textContent = message;
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(),2000)
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }


}
// Store Class: Handles Storage

class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books')=== null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books')) ;
        }

        return books; // başka yerde kullanacağız
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index,1)
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks); // UIda gösterme
//Event: Add A Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //get form values
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fiil in all fields', "danger");
    }
    else{
         // Instatiate book
        const book = new Book (title, author, isbn);

        // Add book to UI
        UI.addBookList(book);
        console.log(book);

        // Add book to LS
        Store.addBook(book);

        // Clear fields
        UI.clearFields();
        UI.showAlert("Succesfly ", "success")
    }
   
});
// Event Remove Book

document.querySelector('#book-list').addEventListener('click', (e) => 
{
    // remove book from UI
    UI.deleteBook(e.target)
    UI.showAlert("delete succes ", "success") 

    //remove book grom store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    console.log(e.target.parentElement.previousElementSibling.textContent);;
}) 