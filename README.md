<div align="center">
    <img src="./public/images/unlock.png"
    width="200" style="clip-path: circle(50% at 50% 50%);
">
</div>

# Auth Service

The Auth Service provides endpoints for user registration, login, and logout, including email verification and password management. It also supports token generation and management, as well as Google authentication integration.

## Features

- **User Registration**: Register new users with a username, email, and password.
- **User Login**: Authenticate users using their email and password.
- **User Logout**: Securely log out authenticated users.

## Prerequisites

- Node.js (v20.15.0 or later)
- MongoDB

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/LakshayManglani/auth-service.git
   cd auth-service
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory and copy the .env.example content and replace it's value with your own environment:

## How to contribute

We welcome contributions from the community. Please follow these steps to contribute:

1. **Fork the repository**.
2. **Create a new branch**:
   ```bash
   git checkout -b feat/feature-branch-name
   ```
3. **Make your changes and commit them**:
   ```bash
   git commit -m "feat(scope): description of changes"
   ```
4. **Push to the branch**:
   ```bash
   git push origin feat/feature-branch-name
   ```
5. **Create a pull request** detailing your changes.

For more details on the commit format and other guidelines, please refer to the [Contributor Guidelines](./CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or issues, please open an issue on GitHub or reach out to us using the following email addresses:

[@LakshayManglani](https://github.com/LakshayManglani):
**[lakshaymanglani2212@gmail.com](mailto:lakshaymanglani2212@gmail.com)**

---

Thank you for using our Auth Service! We hope it helps you manage authentication in your projects efficiently.