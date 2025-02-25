;; sbtc-registry.clar
;; This contract maintains the registry of sBTC operations and wallet addresses

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-address (err u101))

;; Data vars
(define-data-var bitcoin-wallet (buff 128) 0x)
(define-data-var threshold-signer principal tx-sender)

;; Maps
(define-map wallet-addresses principal (buff 33))
(define-map authorized-signers principal bool)

;; Public functions
(define-public (set-bitcoin-wallet (new-wallet (buff 128)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (var-set bitcoin-wallet new-wallet))))

(define-public (register-wallet (btc-wallet (buff 33)))
  (ok (map-set wallet-addresses tx-sender btc-wallet)))

;; Read only functions
(define-read-only (get-bitcoin-wallet)
  (ok (var-get bitcoin-wallet)))

(define-read-only (get-wallet-address (user principal))
  (ok (map-get? wallet-addresses user)))