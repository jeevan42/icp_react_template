# Event Attendance Tracker

Event Attendance Tracker is a decentralized application (dApp) built on the Internet Computer Protocol (ICP) blockchain network. It allows event organizers to manage attendee registration and track physical attendance using dynamic QR codes.

## Technologies Used

- JavaScript
- Motoko
- React
- Tailwind CSS
- DFINITY (DFX) environment

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

    ```bash
    git clone <repoUrl>
    cd <repoName>
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. For local development:

    - Start the DFINITY environment:

        ```bash
        dfx start --clean
        ```

    - Pull dependencies:

        ```bash
        dfx deps pull
        dfx deps init internet_identity --argument '(null)'
        dfx deps deploy
        ```

    - Deploy the application:

        ```bash
        dfx deploy
        ```

4. For deploying on the IC network:

    ```bash
    dfx deploy --network ic
    ```

## Usage

1. After deploying the project, open the frontend canister live link in your browser.
2. Admin Login:
    - Click on the "Internet Identity" button to login as an admin.
    - Copy the Principal ID shown after login.
    - Assign admin privileges to the Principal ID using the following command:

    1. For local environment

        ```bash
        dfx canister call <backendCanisterId> addOwner '("<principalId>")'
        ```
    2. For ic environment

        ```bash
        dfx canister call <backendCanisterId> addOwner '("<principalId>")' --network ic
        ```

3. Now, login as an admin and access the dashboard.
4. Create a new event by filling out the form.
5. If the event status is ongoing, you can:
    - Show a dynamic QR code for attendee check-in.
    - View event details including the number of generated and claimed seats.
6. Attendee Check-in:
    - Scan the QR code and login with Internet Identity.
    - Claim your seat by clicking the "Claim Seat" button.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).