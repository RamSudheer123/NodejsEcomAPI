

//productID, userID, quantity 
export default class cartItemsModel {
    constructor(id, productID, userID, quantity) {
        this.id = id;
        this.productID = productID;
        this.userID = userID;
        this.quantity = quantity;
    }

    static add(productID, userID, quantity) {
        const newItem = new cartItemsModel(cartItems.length + 1, productID, userID, quantity)
        cartItems.push(newItem)
        return newItem;
    }

    static get(userID) {
        return cartItems.filter((i) => i.userID == userID)
    }

    static delete(cartItemID, userID) {
        const cartItemIndex = cartItems.findIndex((i) => i.id == cartItemID && i.userID == userID)
        if(cartItemIndex == -1) {
            return "Item not found"
        }
        else {
            cartItems.splice(cartItemIndex, 1)
        }
    }
}

var cartItems = [new cartItemsModel(1, 1, 1, 1), new cartItemsModel(2, 2, 2, 1)]