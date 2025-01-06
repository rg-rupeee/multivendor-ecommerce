# Multivendor Ecommerce Application

## Introduction
This is a **Multivendor Ecommerce Application** designed to support various user roles, including customers, vendors, and admins. It allows users to perform operations such as browsing products, managing their carts, and placing orders. Vendors can add and manage products, while admins can oversee the entire platform.

---

## Features
### User Features
- **Authentication:** Signup, signin, reset password, and change password.
- **Profile Management:** View and update user profiles.
- **Cart Management:** Add, update, remove products in the cart, and view the cart.
- **Wishlist:** Add, remove, and view products in the wishlist.
- **Product Browsing:** Search for products, filter by categories, and view product details.

### Vendor Features
- **Vendor Authentication:** Signup, signin, reset password.
- **Product Management:** Add, update, delete, and list products.
- **Order Management:** Manage orders for products listed by the vendor.

### Admin Features
- **User Management:** View, search, and manage all users.
- **Vendor Management:** Manage vendor profiles and oversee vendor operations.
- **Platform Monitoring:** Monitor product listings, transactions, and more.

---

## API Documentation
API Documentation is provided [here](https://documenter.getpostman.com/view/13777820/UyrAEwT6).

The API is designed with REST principles and can be tested using Postman. The Postman collection for this application is available [here](https://grupesh.postman.co/workspace/Team-Workspace~bfbe2cf4-2c45-470c-8c0c-61d4bd43e24d/collection/13777820-a4df70b3-9b13-44b2-9acd-d826e4bc435c?action=share&source=collection_link&creator=13777820).

### Example Endpoints
#### User Authentication
- **Signup:** `POST /api/user/auth/signup`
- **Signin:** `POST /api/user/auth/signin`
- **Reset Password:** `POST /api/user/auth/resetPassword`
- **Forget Password:** `POST /api/user/auth/forgetPassword`

#### Product Management
- **Get All Products:** `GET /api/product`
- **Create Product:** `POST /api/product`
- **Update Product:** `PATCH /api/product/{productId}`
- **Delete Product:** `DELETE /api/product/{productId}`

#### Cart Operations
- **View Cart:** `GET /api/user/cart`
- **Update Cart:** `PUT /api/user/cart`
- **Remove Product from Cart:** `DELETE /api/user/cart/{productId}`

---

## Installation and Setup
1. Clone the repository.
2. Install dependencies using `npm install` or `yarn install`.
3. Set up the environment variables as described in `.env.example`.
4. Run the development server using `npm start` or `yarn start`.

---

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---

Let me know if you would like further refinements or additional sections in this README file.