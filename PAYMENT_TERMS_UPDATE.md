# Payment Terms Update ✅

## What are Net 15 and Net 30?

### Business Payment Terms Explained:

**Net 30** (or "Net 30 Days")
- Payment is due within **30 days** from the invoice date
- Common in B2B (business-to-business) transactions
- Example: Invoice dated Jan 1 → Payment due by Jan 31

**Net 15** (or "Net 15 Days")
- Payment is due within **15 days** from the invoice date
- Faster payment term for urgent transactions
- Example: Invoice dated Jan 1 → Payment due by Jan 16

**Why "Net"?**
- "Net" means the full amount is due (no discounts)
- It's accounting terminology from traditional business practices

---

## Changes Made

### Before (Business Terms):
```
Payment Terms:
- Net 30
- Net 15
- Cash on Delivery
```

### After (User-Friendly Terms):
```
Payment Terms:
- Cash on Delivery
- Advance Payment
- Credit - 15 Days
- Credit - 30 Days
- Partial Payment (50% Advance)
```

---

## New Payment Terms Explained

### 1. **Cash on Delivery (COD)**
- Payment made when goods are delivered
- Most common for retail/direct customers
- No credit period

### 2. **Advance Payment**
- Full payment before delivery
- Used for new customers or high-value orders
- Reduces business risk

### 3. **Credit - 15 Days**
- Payment due within 15 days of invoice
- Replaces "Net 15"
- Clearer for non-business users

### 4. **Credit - 30 Days**
- Payment due within 30 days of invoice
- Replaces "Net 30"
- Standard credit term

### 5. **Partial Payment (50% Advance)**
- 50% paid upfront, 50% on delivery
- Good for large orders
- Balances risk between buyer and seller

---

## Benefits of New Terms

### ✅ Clearer Language
- "Credit - 15 Days" is more understandable than "Net 15"
- Users immediately know what each term means
- No business jargon

### ✅ More Options
- Added "Advance Payment" option
- Added "Partial Payment" option
- Better flexibility for different scenarios

### ✅ Better UX
- Terms are self-explanatory
- No need to explain what "Net" means
- Suitable for all user types

---

## Where This Appears

**Location:** Step 3 - Invoice Generation
- In the Dispatch Workflow
- When creating invoices for orders

**Path to Access:**
1. Open dispatch-app.html
2. Go to "Dispatch Workflow"
3. Start workflow or continue existing workflow
4. Navigate to Step 3: Invoice Generation
5. See updated Payment Terms dropdown

---

## Usage Examples

### Example 1: Retail Customer
```
Customer: Walk-in customer
Payment Term: Cash on Delivery
Reason: Immediate payment, no credit needed
```

### Example 2: New Business Customer
```
Customer: New company
Payment Term: Advance Payment
Reason: First order, establish trust
```

### Example 3: Regular Business Customer
```
Customer: Established client
Payment Term: Credit - 30 Days
Reason: Regular customer with good payment history
```

### Example 4: Large Order
```
Customer: Big order worth ₹5 lakhs
Payment Term: Partial Payment (50% Advance)
Reason: Secure 50% upfront, balance on delivery
```

---

## Comparison Table

| Old Term | New Term | Meaning |
|----------|----------|---------|
| Net 30 | Credit - 30 Days | Pay within 30 days |
| Net 15 | Credit - 15 Days | Pay within 15 days |
| Cash on Delivery | Cash on Delivery | Pay on delivery (same) |
| *(not available)* | Advance Payment | Pay before delivery |
| *(not available)* | Partial Payment (50% Advance) | Pay 50% now, 50% later |

---

## File Modified

- **dispatch-script.js** - Updated Step 3 payment terms dropdown

---

## Testing

### Test Payment Terms Dropdown:
1. Open dispatch-app.html
2. Go to Dispatch Workflow
3. Navigate to Step 3: Invoice Generation
4. Click "Payment Terms" dropdown
5. Verify 5 options appear:
   - ✅ Cash on Delivery
   - ✅ Advance Payment
   - ✅ Credit - 15 Days
   - ✅ Credit - 30 Days
   - ✅ Partial Payment (50% Advance)

---

## Additional Notes

### For Future Enhancement:
You could add more payment terms based on your business needs:
- Credit - 45 Days
- Credit - 60 Days
- Credit - 90 Days
- Partial Payment (30% Advance)
- Partial Payment (70% Advance)
- Letter of Credit (LC)
- Bank Transfer
- Online Payment

### Dynamic Terms:
You could also make payment terms configurable based on:
- Customer type (retail vs business)
- Customer credit rating
- Order value
- Customer payment history

---

## Status

✅ **COMPLETE**

Payment terms have been updated from business jargon (Net 15, Net 30) to clear, user-friendly terms that everyone can understand.

The dropdown now shows 5 payment options that are self-explanatory and cover most common payment scenarios.
