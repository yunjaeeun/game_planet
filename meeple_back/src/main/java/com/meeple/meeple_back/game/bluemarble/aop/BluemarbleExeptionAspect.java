package com.meeple.meeple_back.game.bluemarble.aop;

import com.meeple.meeple_back.common.domain.exception.ResourceNotFoundException;
import com.meeple.meeple_back.game.bluemarble.aop.response.SocketInternalServerError;
import com.meeple.meeple_back.game.bluemarble.exception.PrivateRoomInvalidPasswordException;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Aspect
@Component
public class BluemarbleExeptionAspect {
	private static Logger logger = Logger.getLogger(BluemarbleExeptionAspect.class.getName());
	private final SimpMessagingTemplate simpleMessagingTemplate;

	@Autowired
	public BluemarbleExeptionAspect(SimpMessagingTemplate simpleMessagingTemplate) {
		this.simpleMessagingTemplate = simpleMessagingTemplate;
	}

	@Pointcut("execution(* com.meeple.meeple_back.game.bluemarble..*.*(..))")
	public void targetPackagePointcut() {

	}

	@AfterThrowing(pointcut = "targetPackagePointcut()", throwing = "ex")
	public void handleException(Exception ex) {
		if (ex instanceof PrivateRoomInvalidPasswordException) {
			int roomId = ((PrivateRoomInvalidPasswordException) ex).getRoomId();
			SocketInternalServerError socketInternalServerError = new SocketInternalServerError(roomId, ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());
			simpleMessagingTemplate.convertAndSend("/topic/rooms/" + roomId, socketInternalServerError);
			return;
		}

		if (ex instanceof ResourceNotFoundException) {
			ResourceNotFoundException resourceNotFoundException = (ResourceNotFoundException) ex;
			int id = (int) resourceNotFoundException.getId();
			SocketInternalServerError socketInternalServerError = new SocketInternalServerError(id, resourceNotFoundException.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());
			logger.info("ResourceNotFoundException: " + resourceNotFoundException.getMessage());
			simpleMessagingTemplate.convertAndSend("/topic/rooms/" + id, socketInternalServerError);
			return;
		}
	}

}
