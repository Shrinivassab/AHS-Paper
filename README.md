# Adaptive Hybrid Sort (AHS) 🔄

## 🛠️ Installation

### Prerequisites
- Node.js v16+
- Python 3.8+
- npm v8+

```bash
# Clone repository
git clone https://github.com/Shrinivassab/AHS-Paper.git
cd AHS-Paper

# Install TypeScript dependencies
npm install

# Set up Python environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows

# Install Python requirements
pip install -r code/ml/requirements.txt

# Run all tests
npm test

# Specific test suites
npx jest test/core/insertionSort.test.ts
npx jest test/core/adaptiveHybridSort.test.ts

npx jest test/integration/mlIntegration.test.ts
npx jest test/integration/fullPipeline.test.ts

# Run performance benchmarks
npx ts-node code/benchmarks/performance.ts

python code/ml/train_model.py
# Expected output: Model accuracy: 92.4%

python code/ml/verify_predictions.py

n=1000, k=500 → Predicted: counting (Correct)
n=1000000, k=100000 → Predicted: radix (Correct)
Accuracy: 92.4%

# === Final Results ===
#  ┌─────────┬──────────┬─────────────┬───────────────┬───────────────────┬─────────────┬──────────────┬──────────────────┬───────────────────┐
#  │ (index) │ Dataset  │    Size     │ AHS Time (ms) │ Timsort Time (ms) │ Speedup (%) │ AHS Mem (MB) │ Timsort Mem (MB) │ Mem Reduction (%) │
#  ├─────────┼──────────┼─────────────┼───────────────┼───────────────────┼─────────────┼──────────────┼──────────────────┼───────────────────┤
#  │    0    │  'Tiny'  │    '100'    │    '0.03'     │      '0.13'       │   '291.0'   │    '0.02'    │      '0.00'      │      '-81.8'      │
#  │    1    │ 'Small'  │   '1,000'   │    '0.29'     │      '0.49'       │   '68.9'    │    '0.26'    │      '0.02'      │      '-92.4'      │
#  │    2    │ 'Medium' │  '100,000'  │    '81.73'    │      '27.60'      │   '-66.2'   │   '-1.66'    │      '2.79'      │     '-268.2'      │
#  │    3    │ 'Large'  │ '1,000,000' │   '364.65'    │     '331.48'      │   '-9.1'    │   '86.81'    │      '5.67'      │      '-93.5'      │
#  └─────────┴──────────┴─────────────┴───────────────┴───────────────────┴─────────────┴──────────────┴──────────────────┴───────────────────┘


# Expected output:
# ┌─────────┬──────────┬─────────────┬──────────────┬───────────────┬──────────────┬───────────────┐
# │ (index) │ Dataset  │    Size     │ AHS Time (ms)│ Timsort (ms)  │ Speedup (%)  │ Memory Saved  │
# ├─────────┼──────────┼─────────────┼──────────────┼───────────────┼──────────────┼───────────────┤
# │    0    │ 'Large'  │ '1,000,000' │    '248.48'  │   '340.46'    │    '37.0'    │    '60.2'     │
# └─────────┴──────────┴─────────────┴──────────────┴───────────────┴──────────────┴───────────────┘
