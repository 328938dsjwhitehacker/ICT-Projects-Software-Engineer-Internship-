# Enterprise Virtualisation & Networking Project  
**Diploma in IT (Advanced Networking & Cyber Security) — [Swinburne University of Technology - TAFE Division]**

## Overview  
This project involved designing, implementing and documenting an enterprise-level virtualisation and network infrastructure.  
I configured VMware ESXi hosts, vCenter Server, segmented networks (management, VM, storage), and enterprise storage (NFS + iSCSI). The aim was to deliver a scalable, secure infrastructure suitable for large organisations.

## Tech Stack  
- VMware ESXi (version X.X)  
- vCenter Server (version X.X)  
- Windows Server [version] / Active Directory  
- Network segmentation: VLANs, vSwitch/dvSwitch, NIC teaming  
- Storage: NFS datastore, iSCSI target  
- Tools used: [list tools, e.g., vSphere Client, PowerCLI]

## Architecture  
*(Insert diagram or screenshot here)*  
Describe: “The architecture separates management admins from VM network, and isolates storage traffic for performance.”

## Key Achievements  
- Deployed 2 ESXi hosts, configured NIC teaming & vSwitch for high availability  
- Implemented three VLANs: management (10.x.x.x/24), VM (192.168.x.x/24), storage (172.16.x.x/24)  
- Created an NFS datastore on storage server, configured iSCSI target for shared VM storage  
- Integrated Active Directory for role-based access in vSphere identity source  
- Produced comprehensive documentation: planning, design, implementation, testing, evaluation  
- Compared VMware vs Microsoft Hyper-V in evaluation section, outlining advantages & recommendations

## Skills Demonstrated  
- Infrastructure design & deployment  
- Network segmentation & security best practices  
- Storage networking (NFS, iSCSI)  
- Documentation & technical reporting  
- Problem-solving, testing & evaluation  

## What I Learned  
- The importance of separating network layers to reduce broadcast domains and improve security  
- How to configure role-based access to limit administrative footprint  
- The performance impact of isolating storage traffic on separate network fabric  
- The documentation process: from designs, diagrams, to test evidence and evaluation  

## How To View  
1. Visit the `docs` folder for the full project report (PDF)  
2. View architecture diagrams in `docs/diagrams/`  
3. View screenshots in `screenshots/`  
4. [If you have a video or live demo link, add here]

---

**Future Work**  
- Automate the host provisioning via PowerCLI or Terraform  
- Integrate monitoring tools and alerting (e.g., Prometheus, Grafana)  
- Expand storage architecture to include SAN/NAS hybrid with replication  

