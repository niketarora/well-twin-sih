\# SRP Condition Monitoring Model



\## Overview



This project contains an Autoencoder-based anomaly detection model for

Sucker Rod Pump (SRP) condition monitoring.



The model learns normal operating patterns from SRP sensor data and

calculates an anomaly score using reconstruction error.



The anomaly score is converted into three operating-condition levels:



\- NORMAL

\- WARNING

\- CRITICAL



This model is intended for condition monitoring and abnormal-operation

detection.



\---



\## Model Type



Autoencoder-based anomaly detection using PyTorch.



Architecture:



Input: 6 features



&#x20;   ↓



Linear(6 → 32)

ReLU



&#x20;   ↓



Linear(32 → 16)

ReLU



&#x20;   ↓



Linear(16 → 8)



&#x20;   ↓



Linear(8 → 16)

ReLU



&#x20;   ↓



Linear(16 → 32)

ReLU



&#x20;   ↓



Linear(32 → 6)



The model uses Mean Squared Error (MSE) reconstruction error as the

anomaly score.



\---



\## Input Features



The model requires five sensor/operational inputs.



| Feature | Description |

|---|---|

| SPM | Strokes per minute |

| pump\_fillage | Pump fillage percentage |

| min\_rod\_weight | Minimum rod weight |

| max\_rod\_weight | Maximum rod weight |

| dynamometer\_area | Dynamometer card area |



The sixth feature is derived automatically:



&#x20;   rod\_load\_range = max\_rod\_weight - min\_rod\_weight



Therefore, users only need to provide five input values.



\---



\## Output



The model returns:



```json

{

&#x20;   "condition": "WARNING",

&#x20;   "anomaly\_score": 0.003151,

&#x20;   "warning\_threshold": 0.001276,

&#x20;   "critical\_threshold": 0.007778

}

