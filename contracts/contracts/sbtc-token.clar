;; sbtc-token.clar
;; This contract implements the sBTC token functionality

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))

;; Define the fungible token
(define-fungible-token sbtc)

;; Token configuration
(define-data-var token-uri (string-utf8 256) u"")
(define-data-var token-name (string-utf8 32) u"Stacks Bitcoin")
(define-data-var token-symbol (string-utf8 10) u"sBTC")
(define-data-var decimals uint u8)

;; Public functions
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-mint? sbtc amount recipient)))

(define-public (burn (amount uint) (owner principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-burn? sbtc amount owner)))

;; Read only functions
(define-read-only (get-name)
  (ok (var-get token-name)))

(define-read-only (get-symbol)
  (ok (var-get token-symbol)))

(define-read-only (get-decimals)
  (ok (var-get decimals)))

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance sbtc account)))

(define-read-only (get-total-supply)
  (ok (ft-get-supply sbtc)))